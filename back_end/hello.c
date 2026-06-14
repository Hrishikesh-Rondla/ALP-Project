#include <stdio.h>
#include <stdlib.h>
 
char arr[20];
 
int wait(int s)
{
    while(s<=0);
        return --s;
}
    
int _signal(int s)
{
    return ++s; 
}
    
int writerMutex = 1;
int numOfReaders = 0, numOfWriters = 0;
 
void writer()
{
   writerMutex = wait(writerMutex);
   numOfWriters = _signal(numOfWriters);
        
   printf("\nThe writer writes: ");
   scanf("%s", arr);
        
   numOfWriters = wait(numOfWriters);
   writerMutex = _signal(writerMutex);
    
}
    
void reader()
{
   writerMutex = wait(writerMutex);
   numOfReaders++;
        
   writerMutex = _signal(writerMutex);
        
   writerMutex = wait(writerMutex);
   printf("\nThe reader reads: %s\n", arr);
        
   numOfReaders--;
   writerMutex = _signal(writerMutex);
    
}
   
int main()
{
   int choice;
        
   printf("1.Writer\n2.Reader\n3.Exit\n");
        
   while(1)
   {
        printf("Enter your choice: ");
        scanf("%d", &choice);
        switch(choice)
        {
            case 1:
                   if(writerMutex == 1 && numOfReaders == 0)
                     {
                        writer();
                    }
                    else{
                        printf("readers are reading.\n");
                    }
                    break;
                case 2:
                    if(writerMutex == 1){
                        reader();
                    }
                    else{
                        printf("writer is writing.\n");
                   }
                   break;
               case 3:
                   exit(0);
           }
       }
   }

