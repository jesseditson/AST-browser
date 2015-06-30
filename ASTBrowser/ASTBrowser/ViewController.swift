//
//  ViewController.swift
//  ASTBrowser
//
//  Created by Jesse Ditson on 6/26/15.
//  Copyright (c) 2015 Prix Fixe Labs. All rights reserved.
//

import Cocoa

class ViewController: NSViewController {
    
    @IBOutlet weak var webView: WebView!
    var bridge: WebViewJavascriptBridge?

    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.bridge = WebViewJavascriptBridge(forWebView: self.webView, handler: { (data: AnyObject?, responseCallback: WVJBResponseCallback?) -> Void in
            println("javascript data: \(data)")
            if let string = data as? String {
                if string == "upload" {
                    self.showFileChooser()
                }
            }
        })
        
        self.initWebViewContent()
    }
    
    func openDocument(sender: AnyObject?) {
        showFileChooser()
    }
    
    func openFile(text: NSString?) {
        self.bridge?.callHandler("openFile", data: text, responseCallback: { (message: AnyObject?) -> Void in
            if let string = message as? NSString {
                let error = NSError(domain: "com.prixfixe", code: 200, userInfo: [NSLocalizedDescriptionKey: string])
                NSAlert(error: error).runModal()
            }
        })
    }
    
    func showFileChooser() {
        let openDlg = NSOpenPanel()
        openDlg.canChooseFiles = true
        openDlg.canChooseDirectories = false
        openDlg.allowsMultipleSelection = false
        
        if openDlg.runModal() == NSModalResponseOK {
            let fileURL = openDlg.URL
            var error: NSErrorPointer = NSErrorPointer()
            var string = NSString(contentsOfURL: fileURL!, encoding: NSUTF8StringEncoding, error: error)
            if error != nil {
                if let err = error.memory {
                    NSAlert(error: err).runModal()
                }
            }
            self.openFile(string)
        }
    }
    
    func initWebViewContent() {
        let htmlPath = NSBundle.mainBundle().pathForResource("index", ofType: "html")
        let filePath = NSURL(fileURLWithPath: htmlPath!)
        let request = NSURLRequest(URL: filePath!)
        self.webView.mainFrame.loadRequest(request)
    }

    override var representedObject: AnyObject? {
        didSet {
        // Update the view, if already loaded.
        }
    }


}

