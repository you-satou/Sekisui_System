import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css'],
})

export class AppNavigator implements OnInit{
    
    branchName: string;
    loginUser: string;
    systemDate: Date = new Date();
    day: string[] = ["日", "月", "火", "水", "木", "金", "土"];
        
    ngOnInit(): void {
    
        this.loginUser = '積水　次郎';
        this.branchName = '大阪北支店';
    }

    /**
    * ロカールに時刻を取得する
    */
    getSystemDate(): string {
        return `${this.systemDate.toLocaleDateString()}(${this.day[this.systemDate.getDay()]}) ${this.systemDate.toLocaleTimeString().slice(0, -3)}`;
    }

} 