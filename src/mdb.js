function run(part, file) {
    importClass(java.io.File);
    importClass(org.uecide.Base);
    importClass(java.lang.System);
    importClass(org.uecide.Preferences);
    var jarfile = Preferences.get("programmers.mdb.path");
    var programmer = Preferences.get("programmers.mdb.device");
    if (jarfile == null) {
        ctx.error("Before you can upload with MDB you must first set");
        ctx.error("the path to the mdb.jar file in preferences.");
        ctx.error("After setting or changing the path you will have");
        ctx.error("to restart UECIDE so it can integrate the jar file.");
        return false;
    }

    importClass(com.microchip.mplab.mdb.debugapi.CmdDebugger);
    importClass(com.microchip.mplab.mdb.debugapi.ToolFinder);
    importClass(com.microchip.mplab.mdbcore.debugger.Debugger);

    var cmdDebugger = new CmdDebugger(part);
    var toolFinder = new ToolFinder();
    var assembly = cmdDebugger.getAssembly();
    toolFinder.initialize();
    var properties = cmdDebugger.getToolProperties();

    ctx.bullet("Programming with MDB");

    ctx.bullet2("Connecting to device");

    var toolid = toolFinder.getToolIdByCmdToolName(programmer, 0);
    var meta = toolFinder.getPlatformToolMetaByCmdToolName(programmer);

    if (meta == null) {
        ctx.error("Unable to find device");
        return false;
    }


    var toolclass = meta.getClassName();
    var configurationObjectID = meta.getConfigurationObjectID();
    var platformToolFlavor = meta.getFlavor();

    cmdDebugger.setTool(configurationObjectID, toolclass, platformToolFlavor, toolid);
    cmdDebugger.SetToolProperties(properties);
    if (!cmdDebugger.connect(Debugger.CONNECTION_TYPE.PROGRAMMER)) {
        ctx.error("Cannot connect to device");
        return false;
    }

    ctx.bullet2("Uploading program...");
    if (!cmdDebugger.program(file)) {
        ctx.error("Programming failed");
        cmdDebugger.disconnect();
        return false;
    }
    cmdDebugger.disconnect();
    ctx.bullet("Upload complete");
    return true;
}
