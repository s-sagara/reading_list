//
//  ViewController.swift
//  reading_list
//
//  Created by nttr on 2017/08/22.
//  Copyright © 2017年 nttr. All rights reserved.
//

import UIKit
import URLEmbeddedView

class ViewController: UIViewController,UITableViewDataSource,UITableViewDelegate {
    
    var contentsarray = [webmetas]()
    @IBOutlet var contentstableview: UITableView!
    
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        contentstableview.dataSource = self
        contentstableview.delegate = self
        loadcontents()
        let nib = UINib(nibName: "contentsTableViewCell", bundle: Bundle.main)
        contentstableview.register(nib, forCellReuseIdentifier: "contentscell")
        
        
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
    
    func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
        
        let deleteButton: UITableViewRowAction = UITableViewRowAction(style: .normal, title: "delete!") { (action, index) -> Void in
            let ud = UserDefaults.standard
            self.contentsarray.remove(at: indexPath.row)
            let newdata = NSKeyedArchiver.archivedData(withRootObject: self.contentsarray)
            ud.set(newdata, forKey: "contentsarray")
            ud.synchronize()
            tableView.deleteRows(at: [indexPath], with: .fade)
            self.loadcontents()
        }
        deleteButton.backgroundColor = UIColor.red
        
        return [deleteButton]
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "contentscell") as! contentsTableViewCell
        cell.label.text = contentsarray[indexPath.row].title
        cell.thumbnail.image = UIImage(data: contentsarray[indexPath.row].image)
        return cell
    }
    
    
    func loadcontents(){
        
        let ud = UserDefaults.standard
        if ud.data(forKey: "contentsarray") != nil{
            
            let contentsdata = ud.data(forKey: "contentsarray")
            if let data = contentsdata{
            
                contentsarray = NSKeyedUnarchiver.unarchiveObject(with: data) as! [webmetas]
            }
            contentstableview.reloadData()
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        self.performSegue(withIdentifier: "toDetail", sender: nil)
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toDetail" {
            
            let detailViewController:DetailViewController = segue.destination as! DetailViewController
            
            let selectedindexpath = contentstableview.indexPathForSelectedRow!
            
            detailViewController.targetURL = contentsarray[selectedindexpath.row].metaurl
            detailViewController.targettitle = contentsarray[selectedindexpath.row].title
            //            detailviewcontroller.selectedrow = selectedindexpath.row
            
        }
        
    }
    
    @IBAction func addpage(){
        
        let clip = UIPasteboard.general
        
        guard let pasteString = clip.string else {
            let alertController = UIAlertController(title: "追加できません！",message: "クリップボードが空です。", preferredStyle:UIAlertControllerStyle.alert)
            
            let okAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.default){ (action: UIAlertAction) in
                alertController.dismiss(animated: true, completion: nil)
            }
            alertController.addAction(okAction)
            self.present(alertController, animated: true, completion: nil)
            
            return
        }
        
        print(pasteString)
        
        if pasteString == ""{
            
            let alertController = UIAlertController(title: "追加できません！",message: "クリップボードが空です。", preferredStyle:UIAlertControllerStyle.alert)
            
            let okAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.default){ (action: UIAlertAction) in
                alertController.dismiss(animated: true, completion: nil)
            }
            alertController.addAction(okAction)
            self.present(alertController, animated: true, completion: nil)
            
        }else if !pasteString.hasPrefix("http"){
            
            let alertController = UIAlertController(title: "追加できません！",message: "URLがコピーされていません。", preferredStyle:UIAlertControllerStyle.alert)
            
            let okAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.default){ (action: UIAlertAction) in
                alertController.dismiss(animated: true, completion: nil)
            }
            alertController.addAction(okAction)
            self.present(alertController, animated: true, completion: nil)
            
        }else {
            //ページの追加
            let ud = UserDefaults.standard
            if ud.data(forKey: "contentsarray") != nil {
                
                let contentsdata = ud.data(forKey: "contentsarray")
                if let data = contentsdata {
                    contentsarray = NSKeyedUnarchiver.unarchiveObject(with: data) as! [webmetas]
                }
                var ogtitle: String = ""
                
                OGDataProvider.shared.fetchOGData(urlString: pasteString) { ogData, error in
                    if ogtitle != ""{
                    ogtitle = ogData.pageTitle
                    }else{
                        ogtitle = ogData.sourceUrl
                    }
                    _ = OGImageProvider.shared.loadImage(urlString: ogData.imageUrl, completion: { (image, error) in
                        var newimage:UIImage!
                        if image == nil{
                            newimage = UIImage(named: "noimage.png")
                            
                        }else{
                            newimage = image
                        }

                        let data = UIImagePNGRepresentation(newimage)
                        let metas = webmetas(metaurl: pasteString, image: data!, title: ogtitle)
                        
                        self.contentsarray.append(metas)
                        let newdata = NSKeyedArchiver.archivedData(withRootObject: self.contentsarray)
                        ud.set(newdata, forKey: "contentsarray")
                        ud.synchronize()
                        self.loadcontents()
                        
                    })
                    
                    
                }
                
            }else {
                
                var ogtitle: String = ""
                OGDataProvider.shared.fetchOGData(urlString: pasteString) { ogData, error in
                    if ogtitle != ""{
                    ogtitle = ogData.pageTitle
                    }else{
                        ogtitle = ogData.sourceUrl
                    }
                    _ = OGImageProvider.shared.loadImage(urlString: ogData.imageUrl, completion: { (image, error) in
                        var newimage:UIImage!
                        if image == nil{
                            newimage = UIImage(named: "noimage.png")
                            
                        }else{
                            newimage = image
                        }
                        
                        let data = UIImagePNGRepresentation(newimage)
                        let metas = webmetas(metaurl: pasteString, image: data!, title: ogtitle)
                        self.contentsarray.append(metas)
                        let newdata = NSKeyedArchiver.archivedData(withRootObject: self.contentsarray)
                        ud.set(newdata, forKey: "contentsarray")
                        ud.synchronize()
                        self.loadcontents()
                    })
                }
                
                
            }
        }
    }
}

