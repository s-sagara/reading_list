//
//  ViewController.swift
//  reading_list
//
//  Created by nttr on 2017/08/22.
//  Copyright © 2017年 nttr. All rights reserved.
//

import UIKit

class ViewController: UIViewController,UITableViewDataSource,UITableViewDelegate {

    var contentsarray = [String]()
    @IBOutlet var contentstableview: UITableView!

    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        contentstableview.dataSource = self
        contentstableview.delegate = self
        loadcontents()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        loadcontents()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return contentsarray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "contentscell")!
        cell.textLabel?.text = contentsarray[indexPath.row]
        return cell
    }


    func loadcontents(){
        
        let ud = UserDefaults.standard
        if ud.array(forKey: "memoarray") != nil{
            
            contentsarray = ud.array(forKey: "contentsarray") as! [String]
            contentstableview.reloadData()
        }
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        self.performSegue(withIdentifier: "toDetail", sender: nil)
        tableView.deselectRow(at: indexPath, animated: true)
    }

    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toDetail" {
            
//            let detailviewcontroller = segue.destination as! DetailViewController
//            let selectedindexpath = memotableview.indexPathForSelectedRow!
//            detailviewcontroller.selectedmemo = memoarray[selectedindexpath.row]
//            detailviewcontroller.selectedrow = selectedindexpath.row
            
        }
        
    }
    
}

