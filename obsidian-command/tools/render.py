#!/usr/bin/env python3
"""
OBSIDIAN RENDER ENGINE v3 — vectorized numpy raytracer
100% original code. Produces 3D renders for the OBSIDIAN universe.
Usage: python render.py <scene> [width] [height] [samples]
Scenes: sigil warship helmet planet probe throne
"""
import numpy as np, sys, os, time
from PIL import Image

W, H, SAMPLES = 1600, 900, 3
OUT = os.path.join(os.path.dirname(__file__), "..", "deliverables", "renders")

def rot_x(a): c,s=np.cos(a),np.sin(a); return np.array([[1,0,0],[0,c,-s],[0,s,c]])
def rot_y(a): c,s=np.cos(a),np.sin(a); return np.array([[c,0,s],[0,1,0],[-s,0,c]])
def rot_z(a): c,s=np.cos(a),np.sin(a); return np.array([[c,-s,0],[s,c,0],[0,0,1]])

class Mat:
    __slots__=("col","emis","refl","rough","alpha","noShadow")
    def __init__(self, col, emis=0.0, refl=0.0, rough=0.0, alpha=1.0, noShadow=False):
        self.col=np.array(col,float); self.emis=emis; self.refl=refl; self.rough=rough; self.alpha=alpha; self.noShadow=noShadow

class Obj:
    __slots__=("m","R")
    def __init__(self,m,R=None): self.m=m; self.R=R if R is not None else np.eye(3)

class Sphere(Obj):
    def __init__(self,c,r,m): super().__init__(m); self.c=np.array(c,float); self.r=r
    def hit(self,o,d,eps=1e-4):
        oc=o-self.c; b=np.einsum('ij,ij->i',oc,d); c=np.einsum('ij,ij->i',oc,oc)-self.r*self.r
        disc=b*b-c; s=np.sqrt(np.maximum(disc,0))
        t1=-b-s; t2=-b+s
        tt=np.where(t1>eps,t1,t2); ok=(disc>0)&(tt>eps)
        t=np.where(ok,tt,np.inf)
        p=o+d*t[:,None]; n=(p-self.c)/self.r
        return t,p,n,ok
class Box(Obj):
    def __init__(self,c,s,m,R=None): super().__init__(m,R); self.c=np.array(c,float); self.s=np.array(s,float)
    def hit(self,o,d,eps=1e-4):
        od=d@self.R.T; oo=(o-self.c)@self.R.T
        inv=1.0/np.where(np.abs(od)<1e-8,1e-8,od)
        t1=(-oo-self.s/2)*inv; t2=(-oo+self.s/2)*inv
        lo=np.maximum.reduce([np.minimum(t1[:,i],t2[:,i]) for i in range(3)])
        hi=np.minimum.reduce([np.maximum(t1[:,i],t2[:,i]) for i in range(3)])
        ok=(lo<hi)&(hi>eps)
        t=np.where(ok,np.where(lo>eps,lo,hi),np.inf)
        p=o+d*t[:,None]; n=(p-self.c)@self.R.T
        return t,p,n,ok
class Plane(Obj):
    def __init__(self,n,off,m): super().__init__(m); self.n=np.array(n,float)/np.linalg.norm(n); self.off=off
    def hit(self,o,d,eps=1e-4):
        den=d@self.n; ok=np.abs(den)>1e-6
        t=-(o@self.n+self.off)/np.where(ok,den,1); ok&=t>eps
        t=np.where(ok,t,np.inf); p=o+d*t[:,None]
        n=np.broadcast_to(self.n,(o.shape[0],3)).copy()
        return t,p,n,ok
class Cylinder(Obj):
    def __init__(self,c,r,h,m): super().__init__(m); self.c=np.array(c,float); self.r=r; self.h=h
    def hit(self,o,d,eps=1e-4):
        oc=o-self.c
        a=d[:,0]**2+d[:,2]**2; b=2*(oc[:,0]*d[:,0]+oc[:,2]*d[:,2]); cc=oc[:,0]**2+oc[:,2]**2-self.r**2
        disc=b*b-4*a*cc; s=np.sqrt(np.maximum(disc,0)); den=np.where(a>1e-9,a,1)
        t1=(-b-s)/(2*den); t2=(-b+s)/(2*den)
        tt=np.where(t1>eps,t1,t2); ok=(disc>0)&(tt>eps)
        t=np.where(ok,tt,np.inf)
        p=o+d*t[:,None]; ok&=(np.abs(p[:,1]-self.c[1])<=self.h/2)
        t=np.where(ok,t,np.inf)
        n=np.zeros_like(p); n[:,0]=p[:,0]-self.c[0]; n[:,2]=p[:,2]-self.c[2]
        nl=np.linalg.norm(n,axis=1,keepdims=True); n=n/np.where(nl>0,nl,1)
        return t,p,n,ok

# ── scenes ─────────────────────────────────────────────────
def scene_sigil():
    gold=Mat([0.72,0.58,0.30], refl=0.5, rough=0.2)
    dark=Mat([0.10,0.10,0.14], refl=0.25, rough=0.4)
    core=Mat([1.0,0.32,0.38], emis=2.6)
    halo=Mat([1.0,0.06,0.08], emis=0.10, alpha=0.0)
    halo2=Mat([1.0,0.05,0.07], emis=0.032, alpha=0.0)
    steel=Mat([0.32,0.34,0.42], refl=0.6, rough=0.2)
    objs=[]
    for i in range(12):
        a=i*np.pi/6
        objs.append(Box([0,0.3,1.25],[0.18,3.0,0.62],gold,rot_y(a)))
        objs.append(Box([0,-0.1,2.05],[0.26,0.6,0.8],dark,rot_y(a+np.pi/12)))
    objs.append(Sphere([0,0,0],0.55,core))
    objs.append(Sphere([0,0,0],1.05,halo))
    objs.append(Sphere([0,0,0],1.65,halo2))
    objs.append(Cylinder([0,0,0],0.95,0.14,steel))
    objs.append(Cylinder([0,0,0],1.42,0.08,steel))
    lights=[(np.array([4,5,3]),np.array([1,1,1])*3.0),(np.array([-4,-2,2]),np.array([0.9,0.2,0.2])*1.2),(np.array([0,4,-4]),np.array([0.4,0.4,0.6])*1.0),(np.array([2,-3,3]),np.array([0.3,0.3,0.5])*0.8)]
    return objs,lights,np.array([0,0.6,-5.6]),np.array([0,0.1,0])

def scene_warship():
    hull=Mat([0.23,0.24,0.29], refl=0.35, rough=0.3)
    hull2=Mat([0.31,0.32,0.39], refl=0.4, rough=0.25)
    red=Mat([1.0,0.15,0.2], emis=2.6)
    engine=Mat([0.5,0.3,0.35], emis=1.2)
    dark=Mat([0.08,0.08,0.11], refl=0.2, rough=0.5)
    objs=[Box([0,0,0],[8.0,1.3,17.0],hull),Box([0,0.75,1.2],[5.0,0.6,8.5],hull2),Box([0,1.35,3.0],[2.4,0.4,4.4],hull2)]
    for dx in (-2.7,2.7):
        objs.append(Box([dx,0,7.6],[1.2,1.7,1.0],dark)); objs.append(Sphere([dx,0,8.6],0.55,red))
    for dx in (-1.2,1.2):
        objs.append(Cylinder([dx,-0.35,7.2],0.22,1.2,engine)); objs.append(Cylinder([dx,-0.35,7.7],0.4,0.7,red))
    objs.append(Sphere([0,2.0,4.0],0.7,Mat([0.3,0.31,0.36],refl=0.5)))
    objs.append(Sphere([-6.4,-3.0,-9.8],2.2,Mat([0.5,0.08,0.1],emis=0.8)))
    lights=[(np.array([6,8,-5]),np.array([1,1,1])*3.2),(np.array([-6,-4,-3]),np.array([0.9,0.2,0.2])*1.4)]
    return objs,lights,np.array([2.6,1.1,-3.6]),np.array([0,0,1.2])

def scene_helmet():
    gloss=Mat([0.12,0.12,0.17], refl=0.5, rough=0.15)
    red=Mat([0.9,0.1,0.15], emis=2.0)
    objs=[Sphere([0,0,0],1.0,gloss),Box([0,-0.35,0],[3,0.7,3],gloss)]
    objs.append(Box([0,0.15,0.3],[0.24,0.5,0.6],gloss,rot_x(0.35)))
    objs.append(Box([0,0.98,0.1],[0.7,0.14,0.6],red))
    objs.append(Box([0,-0.2,1.02],[0.9,0.2,0.06],red))
    objs.append(Sphere([0,1.15,0.1],0.16,red))
    lights=[(np.array([3,4,2]),np.array([1,1,1])*2.0),(np.array([-3,2,-1]),np.array([0.8,0.2,0.2])*1.2),(np.array([0,-3,3]),np.array([0.3,0.3,0.4])*0.8)]
    return objs,lights,np.array([0,0.5,-4.2]),np.array([0,0.2,0])

def scene_planet():
    planet=Mat([0.62,0.07,0.10], rough=0.6)
    ringm=Mat([0.5,0.32,0.18], refl=0.15, rough=0.5, noShadow=True)
    moon=Mat([0.35,0.35,0.4], rough=0.7)
    objs=[Sphere([0,0,0],1.9,planet),Sphere([3.6,0.9,-2.2],0.5,moon)]
    for i in range(24):
        a=i*2*np.pi/24
        objs.append(Box([0,0,0],[2.3+0.12*np.sin(i*3.1),0.02,0.05],ringm,rot_y(a)@rot_x(0.3)))
    lights=[(np.array([4,4,-5]),np.array([1,1,1])*3.6),(np.array([-3,-2,-3]),np.array([0.9,0.2,0.2])*1.4)]
    return objs,lights,np.array([0,0.6,-4.4]),np.array([0,0,0])

def scene_probe():
    body=Mat([0.30,0.30,0.36], refl=0.4, rough=0.3)
    eye=Mat([1.0,0.2,0.25], emis=2.8)
    dark=Mat([0.09,0.09,0.12], refl=0.25, rough=0.4)
    objs=[Sphere([0,0,0],0.7,body),Sphere([0,0.25,0.55],0.16,eye),Sphere([0,0.25,-0.55],0.1,eye)]
    for i in range(6):
        a=i*2*np.pi/6
        objs.append(Box([np.sin(a)*0.62,0,np.cos(a)*0.62],[0.07,0.05,0.9],dark,rot_y(a)))
        objs.append(Sphere([np.sin(a)*0.66,-0.48,np.cos(a)*0.66],0.09,dark))
    objs.append(Box([0,-0.78,0],[0.5,0.1,0.5],dark))
    lights=[(np.array([3,3,-3]),np.array([1,1,1])*3.4),(np.array([-3,-1,-3]),np.array([0.9,0.2,0.2])*1.4)]
    return objs,lights,np.array([0,0.55,-3.4]),np.array([0,0,0])

def scene_throne():
    dark=Mat([0.10,0.10,0.14], refl=0.3, rough=0.35)
    red=Mat([0.9,0.08,0.12], emis=1.8)
    gold=Mat([0.6,0.5,0.28], refl=0.45, rough=0.25)
    objs=[Plane([0,1,0],0.9,dark),Box([0,0,1.2],[1.8,1.6,0.7],dark)]
    objs.append(Box([-1.2,-0.2,1.1],[0.4,1.2,0.5],dark,rot_z(0.3)))
    objs.append(Box([1.2,-0.2,1.1],[0.4,1.2,0.5],dark,rot_z(-0.3)))
    objs.append(Box([0,0.9,1.15],[1.0,0.3,0.5],dark))
    for i in range(12):
        a=i*np.pi/6
        objs.append(Box([0,1.9,0],[0.1,0.6,0.3],red,rot_y(a)))
    objs.append(Sphere([0,2.0,0],0.3,gold))
    objs.append(Sphere([0,2.0,0],0.14,Mat([1,0.4,0.4],emis=2.4)))
    objs.append(Sphere([-1.6,0.5,0],0.6,red)); objs.append(Sphere([1.6,0.5,0],0.6,red))
    lights=[(np.array([0,4,2]),np.array([1,1,1])*2.0),(np.array([-4,-2,3]),np.array([0.6,0.2,0.2])*1.2)]
    return objs,lights,np.array([0,1.1,-5.4]),np.array([0,0.9,0.6])

SCENES={"sigil":scene_sigil,"warship":scene_warship,"helmet":scene_helmet,"planet":scene_planet,"probe":scene_probe,"throne":scene_throne}

def intersect(objs,o,d,filter_self=True):
    """nearest hit: t(N), p(N,3), n(N,3), ok(N), midx(N)"""
    n=o.shape[0]
    t=np.full(n,np.inf); p=np.zeros((n,3)); norm=np.zeros((n,3)); midx=np.full(n,-1)
    for idx,obj in enumerate(objs):
        if obj.m.alpha < 1.0:
            continue
        tt,pp,nn,ok=obj.hit(o,d)
        if filter_self:
            ok=np.logical_and(ok, np.linalg.norm(pp-o,axis=1)>1e-4)
        better=ok&(tt<t)
        t=np.where(better,tt,t); p=np.where(better[:,None],pp,p)
        norm=np.where(better[:,None],nn,norm); midx=np.where(better,idx,midx)
    return t,p,norm,t<np.inf,midx

def background(rd):
    b=np.array([0.010,0.010,0.018])[None,:]
    b=b+np.array([0.05,0.012,0.02])[None,:]*np.clip(rd[:,1:2]*0.5+0.5,0,1)**2
    h=np.sin(rd[:,0:1]*127.1+rd[:,1:2]*311.7)*43758.5453
    frac=h-np.floor(h)
    star=(frac<0.0035)[:,0]
    b[star]+=(0.7*(frac[star,0]*2))[:,None]
    neb=np.abs(np.sin(rd[:,0]*2.1+rd[:,1]*1.3))*0.5
    b=b+np.array([0.05,0.006,0.01])[None,:]*np.clip(neb[:,None]-0.4,0,1)*2.0
    return b

def raytrace(o,d,objs,mats,LIGHTS,depth=0):
    t,p,n,hit,midx=intersect(objs,o,d)
    col=background(d)
    if not hit.any() or depth>3:
        return col
    col=np.zeros_like(p)
    mc=np.stack([m.col for m in mats]); me=np.stack([m.col*m.emis for m in mats])
    mr=np.array([m.refl for m in mats]); mru=np.array([m.rough for m in mats])
    base=mc[midx]; col=base*0.06
    for lp,lc in LIGHTS:
        l=lp-p; dist=np.linalg.norm(l,axis=1,keepdims=True); l=l/np.where(dist>0,dist,1)
        ndl=np.clip(np.einsum('ij,ij->i',n,l),0,None)
        lit=ndl>0
        if lit.any():
            sp=p[lit]+l[lit]*1e-3
            tt,_,_,_,_=intersect([o for o in objs if not o.m.noShadow],sp,l[lit])
            shade=tt>dist[lit,0]-1e-3
            col[lit]+=base[lit]*ndl[lit,None]*lc[None,:]*(1.2/(1+0.18*dist[lit]))*shade[:,None]
    col+=me[midx]
    for obj in objs:
        if obj.m.alpha < 1.0 and obj.m.emis > 0:
            gt,gp,gn,gok=obj.hit(o,d)
            if gok.any():
                col[gok]+=obj.m.col*obj.m.emis*(1.0/(1.0+0.22*gt[gok,None]))
    refl=mr[midx]>0.01
    if refl.any():
        rr=d[refl]-n[refl]*(2*np.einsum('ij,ij->i',d[refl],n[refl]))[:,None]
        rp=p[refl]+rr*1e-3
        rc=raytrace(rp,rr,objs,mats,LIGHTS,depth+1)
        col[refl]+=rc*mr[midx[refl],None]*(1-mru[midx[refl],None])
    return col

def render_scene(scene_name,width,height,samples):
    objs,LIGHTS,cam,lookat=SCENES[scene_name]()
    mats=[o.m for o in objs]
    fwd=lookat-cam; fwd/=np.linalg.norm(fwd)
    right=np.cross(fwd,np.array([0,1,0])); right/=np.linalg.norm(right)
    up=np.cross(right,fwd)
    aspect=width/height; fov=1.0
    rng=np.random.default_rng(0)
    img=np.zeros((height,width,3))
    start=time.time()
    N=width*height
    o=np.broadcast_to(cam,(N,3)).copy()
    for s in range(samples):
        uu=np.tile(np.arange(width),height).astype(float); vv=np.repeat(np.arange(height),width).astype(float)
        uu=(uu-rng.random(N))/width*2-1; vv=(vv-rng.random(N))/height*2-1
        d=fwd[None,:]+right[None,:]*(uu*fov*aspect)[:,None]+up[None,:]*(vv*fov)[:,None]
        d/=np.linalg.norm(d,axis=1,keepdims=True)
        col=raytrace(o,d,objs,mats,LIGHTS)
        img+=col.reshape(height,width,3)
        print(f"  sample {s+1}/{samples} ({time.time()-start:.0f}s)",flush=True)
    img/=samples
    img=np.clip(img,0,None)
    img=(img/(1+img))**0.9
    img=np.clip(img**0.9,0,1)
    yy,xx=np.mgrid[0:height,0:width]
    r=np.sqrt(((xx-width/2)/(width/2))**2+((yy-height/2)/(height/2))**2)
    img*=np.clip(1-0.35*r*r,0,1)[:,:,None]
    arr=(img*255).astype(np.uint8)
    os.makedirs(OUT,exist_ok=True)
    fp=os.path.join(OUT,f"{scene_name}.png")
    Image.fromarray(arr,"RGB").save(fp)
    print(f"  saved {fp} ({time.time()-start:.0f}s)")

if __name__=="__main__":
    scene=sys.argv[1] if len(sys.argv)>1 else "sigil"
    width=int(sys.argv[2]) if len(sys.argv)>2 else 1600
    height=int(sys.argv[3]) if len(sys.argv)>3 else 900
    samples=int(sys.argv[4]) if len(sys.argv)>4 else 3
    print(f"rendering {scene} at {width}x{height} samples={samples}")
    render_scene(scene,width,height,samples)
