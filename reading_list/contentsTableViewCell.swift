//
//  contentsTableViewCell.swift
//  reading_list
//
//  Created by nttr on 2017/08/23.
//  Copyright © 2017年 nttr. All rights reserved.
//

import UIKit

class contentsTableViewCell: UITableViewCell {
    
    @IBOutlet var thumbnail: UIImageView!
    @IBOutlet var label: UITextView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        thumbnail.image = UIImage(named: "Dopuobdp.jpg")
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
    
}
