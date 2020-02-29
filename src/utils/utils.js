export function getFlatMenu (menus) {
  const flatMenus = []
  menus.forEach(item => {
    if (item.children && item.children.length) {
      item.children.forEach(subItem => {
        flatMenus.push({
          key: subItem.key,
          path: subItem.path,
          name: subItem.name
        })
      })
    }
    flatMenus.push({
      key: item.key,
      path: item.path,
      name: item.name
    })
  })
  return flatMenus
}
