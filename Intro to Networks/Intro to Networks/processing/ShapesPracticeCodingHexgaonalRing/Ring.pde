public class Ring extends Shape {

  float rInner;
  float rOuter;
  
  Ring(float a, float b, float c, float d) {
    // super();  // this happens, silently, even if omitted
    x = a;
    y = b;
    rInner = c;
    rOuter = d;
  }
  
  Ring() {
    super(); 
    x = 0;
    y = 0;
    rInner = 10;
    rOuter = 20;
  }
  
  float getArea() {
    float area = (rOuter * rOuter - rInner * rInner) * (float)Math.PI;
    return area;
  }
  
  float getPerimeter() {
    float perimeter = 2 * (rOuter + rInner) * (float)Math.PI;
    return perimeter;
  }
  
  void display() {
    
    super.display();
    ellipse(x,y,rOuter*2,rOuter*2);
    
    fill(192);// fill inner with background color, regardless of state of filled
    ellipse(x,y,rInner*2,rInner*2);
    
    fill(0,0,0,255);
    text("perimeter =" + this.getPerimeter(), x, y);
    text("area =" + getArea(), x, y+20); // this. is implied here 
  }
}