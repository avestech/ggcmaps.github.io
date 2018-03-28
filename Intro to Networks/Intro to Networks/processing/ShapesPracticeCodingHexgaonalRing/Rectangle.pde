public class Rectangle extends Shape {
  
  private float w,h;   
  
  public Rectangle(float a, float b, float c, float d) {
    //super(); // even if skip, we still get this call invis
    x = a;
    y = b;
    w = c;
    h = d;
    // accept Shape's default of filled=false
  }
  
  public float getArea() {
    float area = w * h;
    return area;
  }
  
  public float getPerimeter() {
    return 2*w + 2*h;
  }
  
  public void display() {
    super.display();
    rect(x,y,w,h);
    
    fill(0,0,0);
    text("area=" + getArea(), x, y);
    text("perimeter=" + getPerimeter(), x, y+20);
  }
  
}