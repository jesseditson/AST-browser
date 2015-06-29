//
//  AppDelegate.swift
//  ASTBrowser
//
//  Created by Jesse Ditson on 6/26/15.
//  Copyright (c) 2015 Prix Fixe Labs. All rights reserved.
//

import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    
    var viewController: ViewController? {
        if let window = NSApplication.sharedApplication().mainWindow {
            return window.contentViewController as? ViewController
        }
        return nil
    }

//    func openFileNotifiction(notification: NSNotification) {
//        if let info = notification.userInfo as? NSDictionary {
//            if let document: AnyObject? = info.objectForKey("document"), vc = self.viewController {
//                vc.openFile(document?.toString())
//            }
//        }
//    }

    func applicationDidFinishLaunching(aNotification: NSNotification) {
        // Insert code here to initialize your application
    }

    func applicationWillTerminate(aNotification: NSNotification) {
        // Insert code here to tear down your application
    }


}

