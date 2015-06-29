//
//  JavascriptDocument.swift
//  ASTBrowser
//
//  Created by Jesse Ditson on 6/26/15.
//  Copyright (c) 2015 Prix Fixe Labs. All rights reserved.
//

import Foundation

class JavascriptDocument: NSDocument {
    
    var attributedString: NSAttributedString?
    
//    override func dataOfType(typeName: String, error outError: NSErrorPointer) -> NSData? {
//        // Insert code here to write your document to data of the specified type. If outError != NULL, ensure that you create and set an appropriate error when returning nil.
//        // You can also choose to override -fileWrapperOfType:error:, -writeToURL:ofType:error:, or -writeToURL:ofType:forSaveOperation:originalContentsURL:error: instead.
//        if outError != nil {
//            outError.memory = NSError(domain: NSOSStatusErrorDomain, code: unimpErr, userInfo: nil)
//        }
//        return nil
//    }
    
    
    override func readFromData(data: NSData, ofType typeName: String, error outError: NSErrorPointer) -> Bool {
        var readSuccess = false
        let fileContents = NSAttributedString(data: data, options: nil, documentAttributes: nil, error: &outError.memory)
        if outError != nil && fileContents == nil {
            outError.memory = NSError(domain: NSCocoaErrorDomain, code: NSFileReadUnknownError, userInfo: nil)
        }
        if fileContents != nil {
            readSuccess = true
            self.attributedString = fileContents
        }
        NSNotificationCenter.defaultCenter().postNotificationName("openFile", object: nil, userInfo: ["document": self])
        return readSuccess
    }

}
