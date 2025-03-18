import {computed, Directive, effect, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {tuiAsControl, TuiControl} from '@taiga-ui/cdk/classes';
import {TUI_ALLOW_SIGNAL_WRITES} from '@taiga-ui/cdk/constants';
import type {TuiMonth} from '@taiga-ui/cdk/date-time';
import {TUI_IS_MOBILE} from '@taiga-ui/cdk/tokens';
import {tuiInjectElement, tuiValueBinding} from '@taiga-ui/cdk/utils/dom';
import {
    tuiInjectAuxiliary,
    TuiSelectLike,
    tuiTextfieldIconBinding,
    TuiWithTextfield,
} from '@taiga-ui/core/components/textfield';
import {
    TuiDropdownAuto,
    tuiDropdownEnabled,
    tuiDropdownOpen,
} from '@taiga-ui/core/directives/dropdown';
import {TuiCalendarMonth} from '@taiga-ui/kit/components/calendar-month';
import {TUI_MONTH_FORMATTER} from '@taiga-ui/kit/tokens';

import {TUI_INPUT_MONTH_OPTIONS} from './input-month.options';

@Directive({
    standalone: true,
    selector: 'input[tuiInputMonth]',
    providers: [tuiAsControl(TuiInputMonthDirective)],
    hostDirectives: [TuiWithTextfield, TuiSelectLike, TuiDropdownAuto],
    host: {
        '[disabled]': 'disabled()',
        '(blur)': 'onTouched()',
        '(input)': '$event.inputType?.includes("delete") && clear()',
    },
})
export class TuiInputMonthDirective extends TuiControl<TuiMonth | null> {
    private readonly open = tuiDropdownOpen();
    private readonly formatter = toSignal(inject(TUI_MONTH_FORMATTER), {
        initialValue: () => '',
    });

    protected readonly icon = tuiTextfieldIconBinding(TUI_INPUT_MONTH_OPTIONS);
    protected readonly dropdownEnabled = tuiDropdownEnabled(
        computed(() => !this.nativePickerEnabled && this.interactive()),
    );

    protected readonly textfieldValue = tuiValueBinding(
        computed(() => this.formatter()(this.value())),
    );

    protected readonly calendarSync = effect(() => {
        this.calendar()?.value.set(this.value());
    }, TUI_ALLOW_SIGNAL_WRITES);

    protected onMonthClickEffect = effect((onCleanup) => {
        const subscription = this.calendar()?.monthClick.subscribe((month) => {
            this.onChange(month);
            this.open.set(false);
        });

        onCleanup(() => subscription?.unsubscribe());
    });

    public readonly calendar = tuiInjectAuxiliary<TuiCalendarMonth>(
        (x) => x instanceof TuiCalendarMonth,
    );

    public readonly nativePickerEnabled =
        tuiInjectElement<HTMLInputElement>().type === 'month' && inject(TUI_IS_MOBILE);

    protected clear(): void {
        this.onChange(null);
        this.open.set(true);
    }
}
