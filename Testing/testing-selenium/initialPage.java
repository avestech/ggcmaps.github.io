package PageObjects;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.How;
import org.openqa.selenium.support.PageFactory;

public class initialPage
{
	private WebDriver driver;

	public initialPage(WebDriver driver)
	{
	this.driver = driver;
	PageFactory.initElements(driver,this);

	}
  //this is how  you locate a webelement in selenium
	@FindBy(how = How.XPATH, using = "/html/body/div/div/a[1]")
	private WebElement loginBtn;

	public void clickLogin()
	{ loginBtn.click();

	}
	}
