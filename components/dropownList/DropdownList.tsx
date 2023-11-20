'use client'

// import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

// import {ReactComponent as DownArrow} from '../../public/assets/icon-chevron-down.svg';
// const UpArrow = dynamic(() => import('../../public/assets/icon-chevron-up.svg'), {
//   ssr: false,
// });
// const DownArrow = dynamic(() => import('../../public/assets/icon-chevron-down.svg'), {
//   ssr: false,
// });
// const Checkmark = dynamic(() => import('../../public/assets/icon-check.svg'), {
//   ssr: false,
// });

type Options = {
  options: string[],
  selectedOption: string,
  setSelectedOption: (selectedOption: string) => string,
  currentFieldName: string,
  state: {title: string, status: string, subtasks: [{}], description: string},
  setState: (state: {}) => {}
}

export default function DropdownList(props: Options) {
  const [showDropdown, setShowDropdown] = useState(false);
  const {options, selectedOption, setSelectedOption, currentFieldName, state, setState} = props;

  const handleCategoryDropdown = () => {
    // show or hide dropdown
    setShowDropdown(showDropdown ? false : true);
  }

  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    // handle selecting dropdown options
    const value = e.currentTarget.getAttribute('data-value')
    setSelectedOption(value);
    setState((state) => ({
      ...state, [currentFieldName.toLowerCase()]: value.toLowerCase()
    }))
  }


  return (
    <div className='customSelect drop-down' aria-hidden='true' onClick={handleCategoryDropdown}>
      <div className='customSelectTrigger'>
        <span>{selectedOption.slice(0,1).toUpperCase()}{selectedOption.slice(1)}</span>
        {showDropdown ?
          <Image
          src='/assets/icon-chevron-up.svg'
          height={7}
          width={10}
          alt='up arrow'
          /> :
          <Image
          src='/assets/icon-chevron-down.svg'
          height={7}
          width={10}
          alt='down arrow'
          />
          }
        {/* {showDropdown ? <UpArrow stroke='#4661E6' /> : <DownArrow stroke='#4661E6' /> } */}
      </div>
      <div className={`customSelectOptions ${showDropdown ? 'customSelectHidden' : ''}`}>
        {options.map((option, index) => {
          if (option.toLowerCase() === selectedOption.toLowerCase()) {
            return (
            <div key={index} className='customSelectOption'>
            <span>{option}</span>
            <Image
            src='/assets/icon-check.svg'
            height={8}
            width={10}
            alt='checkmark'
            />
            </div>
            )
          } else {
            return <div key={index} className='customSelectOption' data-value={option} onClick={handleSelect}>{option}</div>
          }
        })}
      </div>
    </div>
  );
}