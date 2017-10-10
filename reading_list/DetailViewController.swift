//
//  DetailViewController.swift
//  reading_list
//
//  Created by nttr on 2017/09/05.
//  Copyright © 2017年 nttr. All rights reserved.
//

import UIKit

class DetailViewController: UIViewController {

    @IBOutlet weak var uiwebview: UIWebView!
    var targetURL = "http://www.google.com/"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let requestURL = NSURL(string: targetURL)
        let req = URLRequest(url: requestURL! as URL)
        uiwebview.loadRequest(req)
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func loadAddressURL() {
        let requestURL = NSURL(string: targetURL)
        let req = URLRequest(url: requestURL! as URL)
        uiwebview.loadRequest(req)
    }

   

}
