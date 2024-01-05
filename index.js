try {
    const result = await fetch('scrimba-info.txt')
    const text = await result.text()
  } catch (err) {
    console.log(err)
  }