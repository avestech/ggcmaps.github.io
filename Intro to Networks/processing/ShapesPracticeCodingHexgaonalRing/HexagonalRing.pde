public class HexagonalRing extends Shape {

  float sInner;
  float sOuter;
  
  HexagonalRing(float a, float b, float c, float d) {
    // super();  // this happens, silently, even if omitted
    x = a;
    y = b;
    sInner = c;
    sOuter = d;
  }
  
  HexagonalRing() {
    super(); 
    x = 0;
    y = 0;
    sInner = 20;
    sOuter = 30;
  }
  
  float getArea() {
    float area = (3*(float)Math.sqrt(3.0)*sOuter)/2;
    return area;
  }
  
  float getPerimeter() {
   float perimeter = 6*sOuter;
   return perimeter;
  }
  
  public void display() {
    
    rectMode(CENTER);
    super.display();
    hexagon(x,y,sOuter);
    
    fill(192);// fill inner with background color, regardless of state of filled
    hexagon(x,y,sInner);
    
    fill(0,0,0,255);
    text("perimeter =" + this.getPerimeter(), x, y);
    text("area =" + this.getArea(), x, y+20); // this. is implied here 
  }
}

  // hexagon drawing code provided here, as promised
  void hexagon(float x, float y, float s) {
    //
    // let's not worry about the geometry of a hexagon too much
    // this should work if you provide the x,y of the center
    // and the side length s
    //
    float x_v1 = x - (s /4) * 3;
    float y_v1 = y;
    float x_v2 = x - (s * 0.375);
    float y_v2 = y + (s * 0.65);
    float x_v3 = x + (s * 0.375);
    float y_v3 = y + (s * 0.65);
    float x_v4 = x + (s /4) * 3;
    float y_v4 = y;
    float x_v5 = x + (s * 0.375);
    float y_v5 = y - s * 0.65;
    float x_v6 = x - (s * 0.375);
    float y_v6 = y - s * 0.65;

    beginShape();
    vertex(x_v1, y_v1);
    vertex(x_v2, y_v2);
    vertex(x_v3, y_v3);
    vertex(x_v4, y_v4);
    vertex(x_v5, y_v5);
    vertex(x_v6, y_v6);
    endShape(CLOSE);
  }