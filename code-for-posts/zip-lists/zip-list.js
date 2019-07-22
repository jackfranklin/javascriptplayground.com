const partionListByIndex = (list, index) => {
  return list.reduce(
    (accumlator, currentValue, currentIndex) => {
      if (currentIndex < index) {
        return {
          ...accumlator,
          before: [...accumlator.before, currentValue],
        }
      } else if (currentIndex > index) {
        return {
          ...accumlator,
          after: [...accumlator.after, currentValue],
        }
      } else {
        return accumlator
      }
    },
    { before: [], after: [] }
  )
}

const zipList = initialArray => {
  const [initialActive, ...restOfTabs] = initialArray

  const zip = {
    previous: [],
    current: initialActive,
    next: restOfTabs,
  }

  const apiForZip = zip => ({
    asArray: () => [...zip.previous, zip.current, ...zip.next],
    isActive: tab => zip.current === tab,
    setActive: setActive(zip),
    activeTab: () => zip.current,
  })

  const setActive = zip => newActive => {
    if (zip.next.includes(newActive)) {
      const {
        before: nextItemsBeforeActive,
        after: nextItemsAfterActive,
      } = partionListByIndex(
        zip.next,
        zip.next.findIndex(item => item === newActive)
      )
      const newZip = {
        previous: [...zip.previous, zip.current, ...nextItemsBeforeActive],
        current: newActive,
        next: [...nextItemsAfterActive],
      }

      return apiForZip(newZip)
    } else if (zip.previous.includes(newActive)) {
      const {
        before: previousItemsBeforeActive,
        after: previousItemsAfterActive,
      } = partionListByIndex(
        zip.previous,
        zip.previous.findIndex(item => item === newActive)
      )

      const newZip = {
        previous: [...previousItemsBeforeActive],
        current: newActive,
        next: [...previousItemsAfterActive, zip.current, ...zip.next],
      }

      return apiForZip(newZip)
    } else {
      // the clicked tab must be the current tab, so just return the original
      return apiForZip(zip)
    }
  }

  return apiForZip(zip)
}

export default zipList
