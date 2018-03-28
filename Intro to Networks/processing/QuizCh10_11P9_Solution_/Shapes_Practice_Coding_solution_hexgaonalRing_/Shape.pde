public class Shape {
  
  protected float x,y;
  private boolean filled = false; 
  protected int red,green,blue;
  
  private boolean outline  = true;
  protected int outline_red, outline_green, outline_blue;
  
  
  Shape() {
    red = 255;    // default color white, RGB = 255,255,255 in Processing
    green = 255;
    blue = 255;
    
  }
  
  public boolean isFilled() {
    return filled;
  }
  
  public void setFilled(boolean a) {
    filled = a;
  }
  
  public void setColor(int a, int b, int c) {
    red = a;
    green = b; 
    blue = c;
  }
  
  public void display() {
    if (isFilled()) 
      fill(red,green,blue);
    else 
      fill(0,0,0,0); // transparent
  }
}