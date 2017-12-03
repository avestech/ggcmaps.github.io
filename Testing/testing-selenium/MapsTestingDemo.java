import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

/**
 * The MapsTestingDemo uses Selenium and JUnit to test search functionality of the GGCMaps web page. The purpose of this
 * class is to demo the tools used for automated testing on this project. This class also tests search functionality by
 * performing a search of one room from each building that supports search functionality.
 *
 * @author  Matthew Soucy
 * @version 1.0
 * @since   2017-11-12
 */
public class MapsTestingDemo {

    /**
     * This method performs the Selenium portions of the MapsTestingDemo class
     * @param str This is the room number to execute the search with
     * @return String This returns the current URL after the search is performed
     */
    public String ggcMaps(String str) {
        System.setProperty("webdriver.chrome.driver", "" /*TODO: Insert path to your ChromeDriver here */); //set driver path for your system
        ChromeDriver driver = new ChromeDriver(); //Selenium driver for Chrome browser
        driver.get("https://soft-eng-practicum.github.io/ggcmaps/#Campus"); //navigate to GGCMaps - soft-eng-practicum URL
        WebElement element = driver.findElement(By.id("roomSearch")); //find search bar
        element.sendKeys(str); //input room number to search
        driver.findElement(By.id("search")).click(); //click to execute the search
        String urlToTest = driver.getCurrentUrl(); //get current URL to verify search was executed properly
        driver.close(); //closes the browser window
        return urlToTest;
    }

    /**
     * This method performs the JUnit portions of the MapsTestingDemo class. The method searches for one room from each
     * searchable room and performs an assert to verify the correct URL was reached with the search term.
     * @param none
     * @return void
     */
    @Test
    public void testGGCMaps(){
        GGCMapsTestDemo demo = new GGCMapsTestDemo();
        String roomName = "A1027";
        String urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#A1027";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room

        roomName = "B2100";
        urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#B2100";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room

        roomName = "C1310";
        urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#C1310";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room

        roomName = "CG360";
        urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#CG360";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room

        roomName = "D1315";
        urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#D1315";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room

        roomName = "E2130";
        urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#E2130";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room

        roomName = "mens-lockers";
        urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#mens-lockers";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room

        roomName = "H3206";
        urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#H3206";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room

        roomName = "I1100";
        urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#I1100";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room

        roomName = "L1108";
        urlValToCheck = "https://soft-eng-practicum.github.io/ggcmaps/#L1108";
        Assert.assertEquals(urlValToCheck, demo.ggcMaps(roomName)); //JUnit assert to verify successful navigation to intended room
    }
}
