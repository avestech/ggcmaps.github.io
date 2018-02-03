import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
/*
Maryam Najiarani
This class contains two different tests that verifies the room search and building search

 */
public class roomSearchTest
{

    private static WebDriver driver;


    @BeforeClass
    public static void setUpChrome() {

        System.setProperty("webdriver.chrome.driver",
                "C:\\Users\\Maryam\\Downloads\\chromedriver.exe");
        driver = new ChromeDriver();
    }

    @Test
    public void searchRoomBuilding () throws Exception
    {
        driver.get("https://soft-eng-practicum.github.io/ggcmaps/#Campus");
        WebElement element= driver.findElement(By.id("roomSearch"));
        element.sendKeys("B3000\n");

        WebElement elemnet1 = driver.findElement(By.xpath("//*[@id=\"3000\"]"));
        String c = elemnet1.getAttribute("class");
        Assert.assertTrue( "Find Building B room 3000 ", c.contains("active-room"));


    }
    @Test
    public void searchBuilding3000 () throws Exception
    {
        driver.get("https://soft-eng-practicum.github.io/ggcmaps/#Campus");
        WebElement element= driver.findElement(By.id("roomSearch"));
        element.sendKeys("3000\n");

        WebElement elemnet1 = driver.findElement(By.xpath("//*[@id=\"building\"]"));
        String c = elemnet1.getText();
        Assert.assertTrue( "Find Building 3000 ", c.equalsIgnoreCase("3"));


    }



}
