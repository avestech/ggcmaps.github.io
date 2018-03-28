Circle c1, c2, c3;
Rectangle r1, r2, r3;
Ring ring1, ring2, ring3;
 SquareRing sring1,sring2,sring3;

ArrayList<Shape> shapes;

void setup() {
  
  size(800,600);
   
  shapes = new ArrayList<Shape>();
 
  c1 = new Circle(width/2, height*0.60, 30);
  c1.setColor(255,0,0);
  shapes.add(c1);
  
  c2 = new Circle(width*0.75, height*0.60, 45);
  c2.setColor(0,255,0);
  c2.setFilled(true);
  shapes.add(c2);
  
  c3 = new Circle(width*0.25, height*0.60, 45);
  c3.setColor(0,0,255);
  c3.setFilled(false);
  shapes.add(c3);
  
  r1 = new Rectangle(width/2, height*0.4, 30 , 15);
  r1.setColor(0,255,0);
  shapes.add(r1);
  
  r2 = new Rectangle(width*0.75, height*0.4, 45, 40);
  r2.setColor(0,255,0);
  r2.setFilled(true);
  shapes.add(r2);
  
  r3 = new Rectangle(width*0.25, height*0.4, 45, 40);
  r3.setColor(0,0,255);
  r3.setFilled(true);
  shapes.add(r3);
  
  ring1 = new Ring(width/2, height*0.8, 10, 20);
  ring1.setColor(255, 0, 0);
  ring1.setFilled(false);
  shapes.add(ring1);
  
  ring2 = new Ring(width*0.75, height*0.8, 10, 50);
  ring2.setColor(0, 255, 0);
  ring2.setFilled(true);
  shapes.add(ring2);
  
  ring3 = new Ring(width*0.25, height*0.8, 30, 40);
  ring3.setColor(0, 0, 255);
  ring3.setFilled(true);
  shapes.add(ring3);
 
  sring1 = new SquareRing(width/2, height*0.20, 10, 20);
  sring1.setColor(255, 0, 0);
  sring1.setFilled(false);
  shapes.add(sring1);
  
  sring2 = new SquareRing(width*0.75, height*0.20, 10, 50);
  sring2.setColor(0, 255, 0);
  sring2.setFilled(true);
  shapes.add(sring2);
  
  sring3 = new SquareRing(width*0.25, height*0.20, 30, 40);
  sring3.setColor(0, 0, 255);
  sring3.setFilled(true);
  shapes.add(sring3); 
  
  
}

void draw() {
  background(192);
  
  for(Shape s : shapes) {
    s.display();
  }
  
}