import org.openqa.selenium.By;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;

import java.net.URL;

//BrowserStack Testing using Windows10 and Chrome57
//this test locates the Search bar, enters 'A' and clicks the search icon.


public class GGCmaps_Test_Windows10_Chrome57_SearchforABuilding {

  public static final String USERNAME = "margaretmuse1";
  public static final String AUTOMATE_KEY = "TkXzjX1qfdisxpdSMPb1";
  public static final String URL = "https://" + USERNAME + ":" + AUTOMATE_KEY + "@hub-cloud.browserstack.com/wd/hub";

  public static void main(String[] args) throws Exception {

    DesiredCapabilities caps = new DesiredCapabilities();
    //set capabilities for desired browser
    caps.setCapability("browser", "Chrome");
    caps.setCapability("browser_version", "57.0");
    caps.setCapability("os", "Windows");
    caps.setCapability("os_version", "10");
    caps.setCapability("resolution", "1024x768");

    //set debugging element to true to enable console logging
    caps.setCapability("browserstack.debug", "true");

    //create new webdriver
    WebDriver driver = new RemoteWebDriver(new URL(URL), caps);
    //hey new driver, open this url
    driver.get("https://soft-eng-practicum.github.io/ggcmaps/#Campus");

    //find the searchbar
    WebElement searchbar = driver.findElement(By.id("roomSearch"));
	//enter A into searchbar
    searchbar.sendKeys("A");
   //element.search();

//find the search icon
    WebElement searchgo = driver.findElement(By.id("search"));
//click on search icon
    searchgo.click();

  //*[@id="search"]
//console prints the title of the URL it just got
    System.out.println(driver.getTitle());
    driver.quit();

  }
}
