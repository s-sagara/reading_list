//
//  webmetas.swift
//  reading_list
//
//  Created by nttr on 2017/10/10.
//  Copyright © 2017年 nttr. All rights reserved.
//

import Foundation

class webmetas: NSObject,NSCoding{

    var metaurl: String = ""
    var image: Data
    var title: String = ""
   
    init(metaurl: String, image: Data, title: String) {
        self.metaurl = metaurl
        self.image = image
        self.title = title
    }

    func encode(with aCoder: NSCoder){
    
        aCoder.encode(metaurl, forKey: "metaurl")
        aCoder.encode(image, forKey: "image")
        aCoder.encode(title, forKey: "title")
    }
    
    required init?(coder aDecoder: NSCoder) {
        self.metaurl = aDecoder.decodeObject(forKey: "metaurl") as! String
        self.image = aDecoder.decodeObject(forKey: "image") as! Data
        self.title = aDecoder.decodeObject(forKey: "title") as! String
    }


}
