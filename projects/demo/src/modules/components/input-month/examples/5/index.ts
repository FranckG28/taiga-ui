import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {changeDetection} from '@demo/emulate/change-detection';
import {encapsulation} from '@demo/emulate/encapsulation';
import {TuiMonth} from '@taiga-ui/cdk';
import {TuiTextfield} from '@taiga-ui/core';
import {TuiInputMonth} from '@taiga-ui/kit';

@Component({
    standalone: true,
    imports: [FormsModule, TuiInputMonth, TuiTextfield],
    templateUrl: './index.html',
    encapsulation,
    changeDetection,
})
export default class Example {
    protected readonly min = TuiMonth.currentLocal().append({month: -12});
    protected readonly max = TuiMonth.currentLocal().append({month: 12});
    protected value: TuiMonth | null = null;
}
