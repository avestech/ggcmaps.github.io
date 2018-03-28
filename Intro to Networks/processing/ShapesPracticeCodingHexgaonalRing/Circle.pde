public class Circle extends Shape {
  
  private float r;   // r is the radius of the circle
  
  public Circle(float a, float b, float c) {
    super(); // this is effectively like new Shape()
    x = a;
    y = b;
    r = c;
    // accept Shape's default of filled=false
    
  }
  
  public float getArea() {
    float area = (float)Math.PI * r * r;
    return area;
  }
  
  public float getPerimeter() {
    return (float)Math.PI * 2.0 * r;
  }
  
  public void display() {
    super.display();
    ellipse(x,y,2*r,2*r);
    
    fill(0,0,0);
    text("area=" + getArea(), x, y);
    text("perimeter=" + getPerimeter(), x, y+20);
  }
  
}