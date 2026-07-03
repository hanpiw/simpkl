function doGet() {

    const template = HtmlService.createTemplateFromFile('index');
  
    const email = Session.getActiveUser().getEmail();
  
    template.userEmail = email;
    template.userRole = checkRole(email);
  
    return template
      .evaluate()
      .setTitle("SIMPKL Robotics")
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  
  }
  
  function include(filename) {
  
    return HtmlService
      .createHtmlOutputFromFile(filename)
      .getContent();
  
  }