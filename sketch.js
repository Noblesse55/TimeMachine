//images for scenes
let kitchen
let ovenGlass
let ovenTransparency = 180
let kitchenNoDoor
let kitchenDoorOpen

//buttons
let startButton
let stopButton
let restartButton
//might not use this
let finishButton

//bread variables
let breadArray = []
let breadCounter = 0
let breadTimer
let breadTint = 50

//draggable bread variables
let breadX
let breadY
let breadDrag = false
let offsetX = 0
let offsetY = 0
let breadWidth
let breadHeight
let draggable = false
let breadDrop = false

//the perfect loaf
let loaf

//misc variables
let doorOpen = false
let myFont
let speechBubble
let title
let clicked = false


function preload()
{
  kitchen = loadImage('Kitchen-1.png')

  kitchenNoDoor=loadImage('KitchenNoDoor.png')
  ovenGlass=loadImage('OvenGlass.png')

  kitchenDoorOpen=loadImage('KitchenDoorOpen.png')

  //inserting images into array
  breadArray[0] = loadImage('Baked Bread-1.png.png')
  breadArray[1] = loadImage('Baked Bread-2.png.png')
  breadArray[2] = loadImage('Baked Bread-3.png.png')
  breadArray[3] = loadImage('Baked Bread-4.png.png')
  breadArray[4] = loadImage('Baked Bread-5.png.png')
  breadArray[5] = loadImage('Baked Bread-6.png.png')
  breadArray[6] = loadImage('Baked Bread-7.png.png')

  myFont = loadFont('RetroGaming.ttf')

  speechBubble = loadImage('SpeechBubble.png')
  title = loadImage('Wood.png')

  loaf = loadImage('Bread-1.png.png')

}

function setup() 
{

  //set breadX and Y variables here because windowHeight/Width not possible pre setup
  breadX=windowWidth*0.652
  breadY=windowHeight*0.35

  breadWidth=windowWidth*0.25
  breadHeight=windowHeight*0.5

  createCanvas(windowWidth, windowHeight)

  //create start button
  startButton=createButton("Start Baking!")
  startButton.position(windowWidth*0.02,windowHeight*0.6)
  startButton.size(250,100)
  startButton.style('font-family','RetroGaming')
  startButton.style('font-size','35px')

  //set kitchen as bg
  //makes the image fill the whole page
  //img, x,y, width, height,transforms from bottom corner(?),source width, source height, fit to window
  //defaul kitchen
  image(kitchen,0,0, width, height, 0,-15,image.width, image.height, COVER)

  image(title,windowWidth*0.6,windowHeight*0.05,title.width*1.2,title.height*1.2)
  textSize(40)
  textFont(myFont)
  textAlign(CENTER)
  text('Baking with Baba!',windowWidth*0.71,windowHeight*0.15,100,300)

  //check if button is clicked
  startButton.mousePressed(() => 
  {
    clicked = true
    //sets starting item in array
    breadCounter = 0 

    //clears all assets and removes button
    clear()
    startButton.remove()
    //start baking function
    baking()

  })

}

//stops scrolling from happening
function mouseWheel()
{
  return false;
}

function draw() 
{
  textSize(15)
  textAlign(LEFT)
  text('Your dad needs your help with the bakery, but he wants to train you first. Your oven is also broken, so youll have to watch the loaf bake! Pay attention and stop the oven when you think its baked.',windowWidth*0.4,windowHeight*0.08,250,200)

  if (clicked)
  {
    image(kitchenNoDoor,0,0, width, height, 0,150,kitchenNoDoor.width,kitchenNoDoor.height, COVER)

    //tint then noTint() stops opacity from layering
    tint(breadTint)
    image(breadArray[breadCounter],breadX,breadY,breadWidth,breadHeight)
    noTint()

    //tint then noTint() stops opacity from layering
    tint(255,ovenTransparency)
    image(ovenGlass,windowWidth*0.594,windowHeight*0.37,windowWidth*0.36,windowHeight*0.56)
    noTint()
    
    if (doorOpen)
    {
      ovenTransparency = 0
      breadTint = 255
      image(kitchenDoorOpen,0,0, width, height, 0,150,kitchenNoDoor.width,kitchenNoDoor.height, COVER)
      image(breadArray[breadCounter],breadX,breadY,breadWidth,breadHeight)

      //applies text style function
      //checks which state the bread is in
      dadSpeech()
      if (breadCounter == 0)
      {
        image(speechBubble,50,100)
        text('Are you kidding? The dough is still cold...',70,170,280,500)
      }
      else if (breadCounter <= 3)
      {
        image(speechBubble,50,100)
        text('Its undercooked. Youre lucky we arent in the bakery yet...',70,130,280,500)
      }
      else if (breadCounter == 4)
      {
        image(speechBubble,50,100)
        text('A perfect golden-brown. Take your loaf out and have a look.',68,140,280,500)
        //drop zone
        fill(255,0)
        noStroke()
        rect(0,0,windowWidth,windowHeight*0.2)
        fill(0)
        textSize(20)
        text('(Take your bread out the oven and put it on the countertop.)',windowWidth*0.3,windowHeight*0.8,250,300)
      }
      else if (breadCounter == 5)
      {
        image(speechBubble,50,100)
        text('Its a little over. Try again.',75,180,280,500)
      }
      else
      {
        image(speechBubble,50,100)
        text('Were you even watching it? Its basically charcoal...',75,155,280,500)
      }

    }

    //if bread is dropped in drop zone then trigger final/ending scene
    if (breadDrop)
    {
      clear()
      imageMode(CORNER)
      tint(100)
      image(kitchen,0,0, width, height, 0,-15,image.width, image.height, COVER)
      noTint()
      imageMode(CENTER)
      image(loaf,windowWidth/2,windowHeight/2)
      textFont(myFont)
      textSize(40)
      fill(255)
      text('Behold. The perfect loaf.',windowWidth/2,windowHeight*0.9)
    }

  }

}

//style function
function dadSpeech()
{
  textSize(25)
  textFont('RetroGaming')
  fill(0)
  textAlign(CENTER)
}

//baking function
function baking()
{
  // randomly update breadCounter
  breadTimer = setInterval(() => 
  {
    // stops at end of array
    if (breadCounter < breadArray.length - 1) 
    {
      breadCounter++
    } 
    else 
    {
      // stops once all bread state shown
      clearInterval(breadTimer) 
    }
    //time interval that is randomly chosen in millisecs
    //minimum time 0.5sec, max time 30 secs
    //max bake time 3mins 30secs
  }, random(1000, 30000))

  //create stop baking button
  stopButton=createButton("Stop Baking!")
  stopButton.position(windowWidth*0.02,windowHeight*0.6)
  stopButton.size(250,100)
  stopButton.style('font-family','RetroGaming')
  stopButton.style('font-size','35px')

  //checks if stop button is pressed
  //if button pressed, then breadTimer stops
  stopButton.mousePressed(() => 
  {
    //if bread is NOT PERFECT
    if (breadCounter != 4)
    {
      doorOpen = true
      clearInterval(breadTimer)
      ovenTransparency = 0
      breadTint = 255
      stopButton.remove()

      restartButton=createButton("Bake another loaf")
      restartButton.position(windowWidth*0.18,windowHeight*0.68)
      restartButton.size(250,150)
      restartButton.style('font-family','RetroGaming')
      restartButton.style('font-size','35px')

      restartButton.mousePressed(() => 
      {
        breadCounter = 0
        doorOpen = false
        breadTint=50
        ovenTransparency=180
        restartButton.remove()
        //restart baking function
        baking()
        draggable=false
      })
    }

    else
    {
      //IF BREAD IS PERFECT
      doorOpen = true
      clearInterval(breadTimer)
      ovenTransparency = 0
      breadTint = 255
      stopButton.remove()
      draggable=true

    }

  })  

}

function mousePressed() 
{
  //if mouse is within bread bounds then do action
  if (draggable && mouseX > breadX && mouseX < breadX + breadWidth && mouseY > breadY && mouseY < breadY + breadHeight)
  {
    //this is the action
    breadDrag = true
    offsetX = mouseX - breadX
    offsetY = mouseY - breadY
  }
}

function mouseDragged()
{
  if(breadDrag)
  {
    breadX = mouseX - offsetX
    breadY = mouseY - offsetY
  }
}

function mouseReleased()
{
  if (breadDrag)
  {
    breadDrag = false

    if (breadY < windowHeight*0.2 || breadY + breadHeight < windowHeight*0.2)
    {
      breadDrop = true
    }
  }
}