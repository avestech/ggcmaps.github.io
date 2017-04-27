
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
//this test locates the Search bar, search "B 1200", find drop down, **switch to second floor pending
//test build in progress
public class Test_FloorChangeDropdown {
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
    driver.get("https://soft-eng-practicum.github.io/ggcmaps/#Campus");
    //search for b 1200
    WebElement searchbar = driver.findElement(By.id("roomSearch"));
    searchbar.sendKeys("B 1200");
    //select search

     WebElement searchgo = driver.findElement(By.id("search"));
     searchgo.click();

     WebElement floordropdown = driver.findElement(By.id("floor"));
     floordropdown.click();

    // WebElement searchgo = driver.findElement(By.id("search"));
    // searchgo.click();


    System.out.println(driver.getTitle());
    driver.quit();

  }
}
