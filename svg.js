function setActive(){
  document.getElementById('myrect').setAttribute('class','active')
  document.getElementById('text').innerHTML = "Great Job!"
}

function setInactive(){
  document.getElementById('myrect').setAttribute('class','inactive')
  document.getElementById('text').innerHTML = "Rollover the Square"
}
