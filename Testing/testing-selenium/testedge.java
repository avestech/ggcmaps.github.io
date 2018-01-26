package Tests;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.edge.EdgeDriver;

import PageObjects.LoginPage;
import PageObjects.initialPage;


public class testedge{



		public WebDriver createDriver()
		{

			System.setProperty("webdriver.edge.driver", "C:\\Users\\mm030\\Downloads\\MicrosoftWebDriver.exe");
      //new driver for Edge
			WebDriver driver = new EdgeDriver();
      //open a new window
			driver.manage().window().maximize();
      ///launch the website in edge
			driver.navigate().to("https://soft-eng-practicum.github.io/ggcmaps/#Campus");

      //MUST RETURN DRIVER
			return driver;

		}

		@Test
		public void firsttest()
		{
		WebDriver driver = createDriver();
  
	initialPage initial = new initialPage(driver);

		}
}
