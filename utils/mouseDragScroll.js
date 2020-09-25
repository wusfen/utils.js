function findScrollNode(node, direction){
  if(!node) return document.documentElement
  var overflow = getComputedStyle(node).overflow
  if(overflow != 'visible') {
    if(direction == 'left'){
      if(node.scrollLeft + node.clientWidth != node.scrollWidth) return node
    }
    if(direction == 'right'){
      if(node.scrollLeft != 0) return node
    }
    if(direction == 'up'){
      if(node.scrollTop + node.clientHeight != node.scrollHeight) return node
    }
    if(direction == 'down'){
      if(node.scrollTop != 0) return node
    }
  }
  return findScrollNode(node.parentElement, direction)
}

var isMouseDown
var x
var y
addEventListener('mousedown', function(e){
  isMouseDown = true
})
addEventListener('mouseup', function(e){
  isMouseDown = false
  x = undefined
  y = undefined
})
addEventListener('mousemove', function(e){
  if(!isMouseDown) return
  var diffX = e.clientX - x
  var diffY = e.clientY - y
  if(x) {
     var scrollXNode = findScrollNode(e.target, diffX<0?'left':'right')
     scrollXNode.scrollLeft -= diffX
  }
  if(y) {
    var scrollYNode = findScrollNode(e.target, diffY<0?'up':'down')
    scrollYNode.scrollTop -= e.clientY - y
  }
  x = e.clientX
  y = e.clientY
})
