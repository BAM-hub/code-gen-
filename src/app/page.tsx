
import Wrapper from '@/templates/Wrapper'

import Filed from '@/templates/Filed'

import Wrapper0Config from '@/embed/0.json'

import Filed1Config from '@/embed/1.json'

import Filed2Config from '@/embed/2.json'


const Page = () => { 
  return ( 
    <>
      
        
            <Wrapper
            
                {...Wrapper0Config}
            
            > 
            
              <Filed
                
                    {...Filed1Config}
                
              /> 
            
              <Filed
                
                    {...Filed2Config}
                
              /> 
            
            </Wrapper> 
          
      
    </>
  ) 
}
export default Page;