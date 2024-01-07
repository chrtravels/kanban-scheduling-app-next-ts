'use client'

import Image from 'next/image';
import { useState } from 'react';


type Props = {
  options: string[],
  selectedOption: string,
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>,
  currentFieldName: string,
  state: {title: string, status: string, subtasks: [{title: string, isCompleted: boolean}], description: string},
  setState: React.Dispatch<React.SetStateAction<{}>>
}

export default function DropdownList(props: Props) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
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
      ...state, [currentFieldName]: value
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
            return <div key={index} className='customSelectOption' data-value={option} onClick={(e) => handleSelect(e)}>{option}</div>
          }
        })}
      </div>
    </div>
  );
}
