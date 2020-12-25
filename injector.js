const scriptList = {
    calculation: {
        file: 'src/averageCalculator.js',
        enabled: true
    },
    loadMarkbook: {
        file: 'src/loadMarkbook.js',
        enabled: true
    },
    liveModification: {
        file: 'src/liveMarkbookCalculator.js',
        enabled: true
    },
    betterTableLayout: {
        file: 'src/betterTableLayout.js',
        enabled: true
    },
    percentages: {
        file: 'src/percentages.js',
        enabled: true
    },
    fixBgColor: {
        file: 'src/fixBgColor.js',
        enabled: true
    }
};

const injectScript = name => {
    let script = document.createElement('script'); // Create a script element
    script.src = chrome.extension.getURL(name); // Grab the absolute path to the script via the Chrome API
    (document.head || document.documentElement).appendChild(script); // Append the script to the <head> if it exists
    script.onload = () => {
        script.parentNode.removeChild(script); // Script removes itself off the page once loaded
    };
};

const injectSettings = settings => {
    let script = document.createElement('script'); // Create a script element
    script.innerHTML = `window.settings = ${JSON.stringify(settings)}`; // Set the value of the settings
    (document.head || document.documentElement).appendChild(script); // Append the script to the document
    script.onload = () => {
        script.parentNode.removeChild(script); // Script removes itself off the page once loaded
    };
};

const injectScriptList = scriptList => {
    chrome.storage.sync.get(null, settings => {

        injectSettings(settings); // Give the DOM access to settings

        if (!settings.calculation && !settings.quickview)
            scriptList.calculation.enabled = false; // Disable the script from loading

        if (!settings.liveModification)
            scriptList.liveModification.enabled = false; // Disable the script from loading
        
        if (!settings.percentages)
            scriptList.percentages.enabled = false; // Disable the script from loading

        if (!settings.betterTableLayout)
            scriptList.betterTableLayout.enabled = false;
        
        Object.keys(scriptList).forEach(script => {
            if (scriptList[script].enabled)
                injectScript(scriptList[script].file);
        });
    });
};

injectScriptList(scriptList);