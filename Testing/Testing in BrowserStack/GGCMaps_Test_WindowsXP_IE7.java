import org.openqa.selenium.By;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.URL;
//BrowserStack Testing using IE7, XP
//Test Status: PASS

public class GGCMaps_Test_WindowsXP_IE7 {

  public static final String USERNAME = "margaretmuse1";
  public static final String AUTOMATE_KEY = "TkXzjX1qfdisxpdSMPb1";
  public static final String URL = "https://" + USERNAME + ":" + AUTOMATE_KEY + "@hub-cloud.browserstack.com/wd/hub";

  public static void main(String[] args) throws Exception {

    DesiredCapabilities caps = new DesiredCapabilities();
    caps.setCapability("browser", "IE");
    caps.setCapability("browser_version", "7.0");
    caps.setCapability("os", "Windows");
    caps.setCapability("os_version", "XP");
    caps.setCapability("browserstack.debug", "true");

    WebDriver driver = new RemoteWebDriver(new URL(URL), caps);
    driver.get("https://soft-eng-practicum.github.io/ggcmaps/");


    System.out.println(driver.getTitle());
    driver.quit();

  }
}
