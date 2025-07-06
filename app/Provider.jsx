"use client"
import React from 'react'


function Provider({ children }) {
  return (
    <div>
      <div className="">
        {children}
      </div>
    </div>
  )
}

export default Provider