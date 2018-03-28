class SquareRing extends Shape {

  float sInner;
  float sOuter;
  
  SquareRing(float a, float b, float c, float d) {
    // super();  // this happens, silently, even if omitted
    x = a;
    y = b;
    sInner = c;
    sOuter = d;
  }
  
  SquareRing() {
    super(); 
    x = 0;
    y = 0;
    sInner = 20;
    sOuter = 30;
  }
  float getInnerDiagonal() {
    return sInner * (float)Math.sqrt(2.0);
  }
  float getOuterDiagonal() {
     return sOuter * (float)Math.sqrt(2.0);
  }
  
  float getArea() {
    float area = (sOuter * sOuter - sInner * sInner);
    return area;
  }
  
  float getPerimeter() {
    float perimeter = 4 * (sOuter - sInner);
    return perimeter;
  }
  
  public void display() {
    
    rectMode(CENTER);
    super.display();
    rect(x,y,sOuter*2,sOuter*2);
    
    fill(192);// fill inner with background color, regardless of state of filled
    rect(x,y,sInner*2,sInner*2);
    
    fill(0,0,0,255);
    text("inner diagonal =" + this.getInnerDiagonal(), x, y);
    text("outer diagonal =" + this.getOuterDiagonal(), x, y+20); // this. is implied here 
  }
}