import org.openqa.selenium.By;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.URL;
//BrowserStack Testing using Windows10 and Edge
public class GGCMaps_Test_Windows10_Edge {




  public static final String USERNAME = "margaretmuse1";
  public static final String AUTOMATE_KEY = "TkXzjX1qfdisxpdSMPb1";
  public static final String URL = "https://" + USERNAME + ":" + AUTOMATE_KEY + "@hub-cloud.browserstack.com/wd/hub";

  public static void main(String[] args) throws Exception {

    DesiredCapabilities caps = new DesiredCapabilities();
    //set capabilities for desired browser
    caps.setCapability("browser", "Edge");
    caps.setCapability("browser_version", "14.0");
    caps.setCapability("os", "Windows");
    caps.setCapability("os_version", "10");
    caps.setCapability("resolution", "1024x768");

    //set debugging element to true to enable console logging
    caps.setCapability("browserstack.debug", "true");

    //create new webdriver
    WebDriver driver = new RemoteWebDriver(new URL(URL), caps);
    driver.get("https://soft-eng-practicum.github.io/ggcmaps/");

    //webelement to get the name of the website above
    WebElement element = driver.findElement(By.name("q"));
    element.sendKeys("BrowserStack");
    element.submit();


//console prints the title of the URL it just got
    System.out.println(driver.getTitle());
    driver.quit();

  }
}
