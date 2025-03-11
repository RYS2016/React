import { useState } from "react";
import { EXAMPLES } from '../data.js'
import TabButton from "./TabButton.jsx";
import Section from "./Section.jsx";
import Tabs from "./Tabs.jsx";

export default function Examples(){
    const [selectedTopic, setSelectedTopic] = useState(); 
    
      
    function handleSelect(selectedButton){
        setSelectedTopic(selectedButton);
    }
    return (
        <Section title="Examples" id="examples">
          <Tabs
            buttonsContainer="menu" //or {Section} - custom component
            buttons={ 
            <>
              <TabButton 
              isSelected={selectedTopic === 'components'}
              onSelect={() => handleSelect('components')}>Components</TabButton>
              <TabButton 
              isSelected={selectedTopic === 'jsx'}
              onSelect={() => handleSelect('jsx')}>JSX</TabButton>
              <TabButton 
              isSelected={selectedTopic === 'props'}
              onSelect={() => handleSelect('props')}>Props</TabButton>
              <TabButton 
              isSelected={selectedTopic === 'state'}
              onSelect={() => handleSelect('state')}>State</TabButton>
            </>
            }
            >{tabContent}
          </Tabs> 
        </Section>
    )
}