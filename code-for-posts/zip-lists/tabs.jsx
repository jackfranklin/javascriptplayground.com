import React from 'react'
import zipList from './zip-list'

export const FirstTabs = () => {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const tabs = [
    { title: 'Tab One', content: 'This is tab one' },
    { title: 'Tab Two', content: 'This is tab two' },
    { title: 'Tab Three', content: 'This is tab three' },
  ]

  const onTabClick = index => {
    setActiveIndex(index)
  }

  return (
    <div>
      <ul className="flex">
        {tabs.map((tab, index) => (
          <li
            key={tab.title}
            onClick={() => onTabClick(index)}
            className={`px-2 py-4 mr-4 border-b-2 mb-4 ${
              index === activeIndex ? 'border-red-800' : 'border-gray-800'
            } hover:border-red-800 cursor-pointer`}
          >
            {tab.title}
          </li>
        ))}
      </ul>

      <div className="border border-gray-400 mt-4 p-8">
        {tabs[activeIndex].content}
      </div>
    </div>
  )
}

export const SecondTabs = () => {
  const [tabs, setTabs] = React.useState(
    zipList([
      { title: 'Tab One', content: 'This is tab one' },
      { title: 'Tab Two', content: 'This is tab two' },
      { title: 'Tab Three', content: 'This is tab three' },
    ])
  )

  return (
    <div>
      <ul className="flex">
        {tabs.asArray().map(tab => (
          <li
            key={tab.title}
            onClick={() => setTabs(tabs.setActive(tab))}
            className={`px-2 py-4 mr-4 border-b-2 mb-4 ${
              tabs.isActive(tab) ? 'border-red-800' : 'border-gray-800'
            } hover:border-red-800 cursor-pointer`}
          >
            {tab.title}
          </li>
        ))}
      </ul>

      <div className="border border-gray-400 mt-4 p-8">
        {tabs.activeTab().content}
      </div>
    </div>
  )
}
