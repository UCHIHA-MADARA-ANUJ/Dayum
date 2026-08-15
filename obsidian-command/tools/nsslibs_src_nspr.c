#include <time.h>
#include <errno.h>
#include <stdint.h>
typedef int PRStatus;
typedef int64_t PRTime;
PRStatus PR_Init(void *t, int pri, int scope) { return 0; }
PRTime PR_Now(void) { struct timespec ts; clock_gettime(CLOCK_REALTIME, &ts); return (PRTime)ts.tv_sec*1000000 + ts.tv_nsec/1000; }
int PR_GetError(void) { return 0; }
int PR_GetOSError(void) { return errno; }
int PR_GetErrorTextLength(void) { return 0; }
char* PR_GetErrorText(char *buf, int size) { return 0; }
