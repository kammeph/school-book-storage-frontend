import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCheck } from '@fortawesome/free-solid-svg-icons';

const PrimitiveSelect: React.FC<{
  value: any | any[];
  options: any[];
  multiple?: boolean;
  required?: boolean;
  onChange: (value: any | any[]) => any;
}> = ({ value, options, multiple, required, onChange }) => (
  <Listbox multiple={multiple} value={value} onChange={onChange}>
    <div className="relative mb-2">
      <Listbox.Button
        className={`${
          required && value?.length === 0
            ? 'ring-2 ring-red-500'
            : 'ring-1 ring-slate-400 focus:ring-2 focus:ring-indigo-600'
        } relative w-full bg-white cursor-default rounded-md py-2 pl-3 pr-10 text-left shadow-md focus:outline-none`}
      >
        <span className="block truncate">
          {`${Array.isArray(value) ? (value?.length > 0 ? value.join(', ') : 'None') : value} ${required ? '*' : ''}`}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <FontAwesomeIcon icon={faAngleDown} className="h-3 w-3 text-gray-400" aria-hidden="true" />
        </span>
      </Listbox.Button>
      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
        <Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              className={({ active }) =>
                `relative bg-white cursor-default select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-indigo-100 text-indigo-800' : 'text-grey-900'
                }`
              }
              value={option}
            >
              {({ selected }) => (
                <>
                  <span className="block truncate">{option}</span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                      <FontAwesomeIcon icon={faCheck} className="h-3 w-3" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
);

export default PrimitiveSelect;
