import React, { MouseEvent } from 'react'

import { ButtonLink } from '../common/links'
import { navLinks } from '../../constants'

const NavBar: React.FunctionComponent<{
  setDrawerOpen: (event: MouseEvent) => void
}> = (props) => {
  return (
    <div className="w-full bg-blue-900">
      <nav className="flex items-center justify-between px-4 py-2">
        <button
          className="text-white mr-2 md:hidden"
          aria-label="menu"
          onClick={props.setDrawerOpen}
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </button>
        <div className="text-white text-lg font-semibold">
          Damien Teo's Site
        </div>
        <div className="hidden md:flex space-x-4">
          {navLinks.map(({ url, text }) => (
            <ButtonLink key={url} url={url} text={text} />
          ))}
        </div>
      </nav>
    </div>
  )
}

export default NavBar
