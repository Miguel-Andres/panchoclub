import { CheckIcon } from '@heroicons/react/20/solid'
import {Image} from "@nextui-org/react";
import NextImage from "next/image";

const includedFeatures = [
  'LLuvia de papas',
  'salsas',
  'salchicha',
  'Gaseosa',
]

export default function Example() {
  return (
    <div className=" py-24 sm:py-32 ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">      
        <div className=" mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-red-400 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto ">
            <h3 className="text-2xl font-bold tracking-tight">Combo 3 panchos</h3>
            <p className="mt-6 text-base leading-7 text-gray-500">
              Combo clasico de 3 panchos + 1 mini gaseosa
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">Incluido</h4>
              <div className="h-px flex-auto bg-red-400" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-400 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature}
                </li>
              ))} 
            </ul>
          </div>
            <div className=' mt-8'>
            <Image
            as={NextImage}
      width={150}
      height={300}
      alt="name the menu"
      src="../public/hotdogs.png" 
    />
            </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">Precio</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-400">$1500</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-400">arg</span>
                </p>
                <a
                  href="#"
                  className="mt-10 block w-full rounded-md bg-green-400 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Comprar
                </a>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
