#include <stdint.h>
typedef int SECStatus;
typedef int PRBool;
typedef void* SECItem;
typedef void* PLArenaPool;
typedef void* CERTCertDBHandle;
typedef void* CERTCertificate;
typedef void* CERTCertList;
typedef void* PK11SlotInfo;
typedef void* SECMODModule;
typedef void* SECMODModuleList;
typedef void* PZLock;
typedef void* PK11GenericObject;
typedef uint32_t CK_OBJECT_HANDLE;
typedef uint32_t CK_ATTRIBUTE_TYPE;
typedef uint32_t CK_OBJECT_CLASS;
SECStatus NSS_NoDB_Init(const char* c) { return 0; }
SECStatus NSS_InitReadWrite(const char* c) { return 0; }
PRBool NSS_VersionCheck(const char* v) { return 1; }
SECStatus NSS_SetAlgorithmPolicy(void* a, unsigned long f, unsigned int b) { return 0; }
SECItem* SECITEM_AllocItem(PLArenaPool* a, SECItem* i, unsigned int l) { return 0; }
void SECITEM_FreeItem(SECItem* i, int f) { }
CERTCertDBHandle* CERT_GetDefaultCertDB(void) { return 0; }
CERTCertificate* CERT_FindCertByDERCert(CERTCertDBHandle* h, SECItem* d) { return 0; }
CERTCertList* CERT_CreateSubjectCertList(CERTCertList* l, PLArenaPool* p, SECItem* d, PRBool a, PRBool b) { return 0; }
void CERT_DestroyCertList(CERTCertList* l) { }
void CERT_DestroyCertificate(CERTCertificate* c) { }
CERTCertificate* CERT_DupCertificate(CERTCertificate* c) { return 0; }
int CERT_GetCertTrust(CERTCertificate* c, void* t) { return -1; }
int CERT_IsUserCert(CERTCertificate* c) { return 0; }
PK11SlotInfo* PK11_GetInternalKeySlot(void) { return 0; }
PK11SlotInfo* PK11_ReferenceSlot(PK11SlotInfo* s) { return s; }
void PK11_FreeSlot(PK11SlotInfo* s) { }
int PK11_IsPresent(PK11SlotInfo* s) { return 0; }
int PK11_NeedUserInit(PK11SlotInfo* s) { return 0; }
int PK11_InitPin(PK11SlotInfo* s, const char* p, const char* a) { return -1; }
void PK11_SetPasswordFunc(void* f) { }
const char* PK11_GetTokenName(PK11SlotInfo* s) { return ""; }
int PK11_HasRootCerts(PK11SlotInfo* s) { return 0; }
int PK11_HasAttributeSet(PK11SlotInfo* s, CK_OBJECT_HANDLE o, CK_ATTRIBUTE_TYPE t, int h) { return 0; }
int PK11_ReadRawAttribute(int t, void* o, CK_ATTRIBUTE_TYPE a, SECItem** i) { return -1; }
SECMODModule* PK11_GetModule(PK11SlotInfo* s) { return 0; }
CERTCertList* PK11_ListCerts(int t, void* a) { return 0; }
CERTCertList* PK11_ListCertsInSlot(PK11SlotInfo* s) { return 0; }
CERTCertificate* PK11_FindCertInSlot(PK11SlotInfo* s, SECItem* d, void* w) { return 0; }
PK11GenericObject* PK11_FindGenericObjects(PK11SlotInfo* s, CK_OBJECT_CLASS c) { return 0; }
PK11GenericObject* PK11_GetNextGenericObject(PK11GenericObject* o) { return 0; }
void PK11_DestroyGenericObjects(PK11GenericObject* o) { }
SECMODModuleList* SECMOD_GetDefaultModuleList(void) { return 0; }
void* SECMOD_GetDefaultModuleListLock(void) { return 0; }
void* SECMOD_GetReadLock(void* l) { return 0; }
void SECMOD_ReleaseReadLock(void* l) { }
SECMODModule* SECMOD_LoadUserModule(const char* s) { return 0; }
void SECMOD_DestroyModule(SECMODModule* m) { }
