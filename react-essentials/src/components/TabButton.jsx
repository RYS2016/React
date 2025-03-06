export default function TabButton({ children, onSelect, isSelected }) {

/*     function handleClick(){
        console.log('Hello World!!!')
    }
 */
    return (
      <li>
        <button 
          className={isSelected ? 'active' : undefined} 
          onClick={onSelect}>
          {children}
        </button>
      </li>
    );
  }

//  document.querySelector('button').addEventListener.apply('click',
//() => {}) ----> in classic JS