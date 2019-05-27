import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import currencyFormatter from "currency-formatter"

import { CategoryService } from '../../categories/shared/category.service';
import { EntryService } from '../../entries/shared/entry.service';
import { Category } from '../../categories/shared/category.model';
import { Entry } from '../../entries/shared/entry.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0
  revenueTotal: any = 0
  balance: any = 0

  expenseChartData: any
  revenueChartData: any

  chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }

  categories: Category[] = []
  entries: Entry[] = []

  @ViewChild('month') month: ElementRef = null
  @ViewChild('year') year: ElementRef = null

  constructor(private categoryService: CategoryService, private entryService: EntryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

  generateReports() {
    const month = this.month.nativeElement.value
    const year = this.year.nativeElement.value

    if (!month || !year) {
      alert('Voce precisa selecionar o Mes e o Ano para gerar os relatorios')
    } else {
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValue.bind(this))
    }
  }

  private setValue(entries: Entry[]) {
    this.entries = entries
    this.calculateBalance()
    this.setChartData()
  }

  private calculateBalance() {
    let expenseTotal = 0
    let revenueTotal = 0
    this.entries.forEach(entry => {
      if (entry.type === 'revenue') {
        revenueTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' })
      } else {
        expenseTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL' })
      }
    })
    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL' })
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL' })
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL' })
  }

  private setChartData() {
    this.revenueChartData = this.getChartData('revenue', 'Graficos de Receitas', '#9CCC65')
    this.expenseChartData = this.getChartData('expense', 'Graficos de Despesas', '#E03131')
  }

  private getChartData(entryType: string, title: string, color: string) {

    const chartData = []
    this.categories.forEach(category => {
      // filtrando lancamentos pela categoria e tipo
      const filterEntries = this.entries.filter(
        entry => (entry.categoryId === category.id && entry.type === entryType)
      )
      // se forem encontrados lacamentos entao somem ao chartData
      if (filterEntries.length > 0) {
        const totalAmount = filterEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL' }), 0
        )
        chartData.push({
          categoryName: category.name,
          totalAmount
        })
      }
    })

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount),
      }]
    }
  }

}
