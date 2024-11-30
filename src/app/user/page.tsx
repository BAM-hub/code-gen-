
import Wrapper from '@/templates/Wrapper'

import Filed from '@/templates/Filed'

import Wrapper3Config from '@/embed/user/3.json'

import Filed4Config from '@/embed/user/4.json'

import Filed5Config from '@/embed/user/5.json'


const Page = () => { 
  return ( 
    <>
      
        
            <Wrapper
            
                {...Wrapper3Config}
            
            > 
            
              <Filed
                
                    {...Filed4Config}
                
              /> 
            
              <Filed
                
                    {...Filed5Config}
                
              /> 
            
            </Wrapper> 
          
      
    </>
  ) 
}
export default Page;