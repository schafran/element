/**
 * Copyright (c) Siemens 2016 - 2025
 * SPDX-License-Identifier: MIT
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const ipv4Regex =
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const ipv4CIDRRegex =
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([1-9]|1[0-9]|2[0-9]|3[0-2]))$/;

// Matches 1:2:3:4:5:6:7:8
const ipV6Regex = /^(([0-9A-Fa-f]{1,4}:){7})([0-9A-Fa-f]{1,4})$/;

// Matches range from 1:2:3:4:5:6:7:8/1 to 1:2:3:4:5:6:7:8/128
const ipV6CIDRRegex =
  /^(([0-9A-Fa-f]{1,4}:){7})([0-9A-Fa-f]{1,4})\/([1-9]|[1-9][0-9]|10[0-9]|11[0-9]|12[0-8])$/;

// Matches
// 1:2:3:4:5:6:7:8              (Full)
// 1:: 1:2:3:4:5:6:7::          (Leading/Trailing compressions)
// 1::8 1:2:3:4:5:6::8          (1 block compressed)
// 1::7:8 1:2:3:4:5::7:8        (2 blocks compressed)
// 1::6:7:8 1:2:3:4::6:7:8      (3 blocks compressed)
// 1::5:6:7:8 1:2:3::5:6:7:8    (4 blocks compressed)
// 1::4:5:6:7:8 1:2::4:5:6:7:8  (5 blocks compressed)
// 1::3:4:5:6:7:8               (6 blocks compressed)
// ::3:4:5:6:7:8
// ::8                          (7 blocks compressed)
// ::                           (All-zeros address)
// IPv4-Embedded / IPv4-Mapped Address (e.g., ::ffff:192.0.2.1)
// see https://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
const ipV6ZeroCompressionRegex =
  /^(([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|([0-9A-Fa-f]{1,4}:){1,7}:|([0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|([0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2}|([0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3}|([0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4}|([0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:((:[0-9A-Fa-f]{1,4}){1,6})|::((?:[0-9A-Fa-f]{1,4}:){1,6})[0-9A-Fa-f]{1,4}|::[0-9A-Fa-f]{1,4}|::|((([0-9A-Fa-f]{1,4}:){6}|::([0-9A-Fa-f]{1,4}:){5}|[0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){4}|([0-9A-Fa-f]{1,4}:){1,2}::([0-9A-Fa-f]{1,4}:){3}|([0-9A-Fa-f]{1,4}:){1,3}::([0-9A-Fa-f]{1,4}:){2}|([0-9A-Fa-f]{1,4}:){1,4}::[0-9A-Fa-f]{1,4}:|([0-9A-Fa-f]{1,4}:){1,5}::)((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])))$/;

const ipV6ZeroCompressionCIDRRegex =
  /^(([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|([0-9A-Fa-f]{1,4}:){1,7}:|([0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|([0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2}|([0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3}|([0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4}|([0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:((:[0-9A-Fa-f]{1,4}){1,6})|::((?:[0-9A-Fa-f]{1,4}:){1,6})[0-9A-Fa-f]{1,4}|::[0-9A-Fa-f]{1,4}|::|((([0-9A-Fa-f]{1,4}:){6}|::([0-9A-Fa-f]{1,4}:){5}|[0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){4}|([0-9A-Fa-f]{1,4}:){1,2}::([0-9A-Fa-f]{1,4}:){3}|([0-9A-Fa-f]{1,4}:){1,3}::([0-9A-Fa-f]{1,4}:){2}|([0-9A-Fa-f]{1,4}:){1,4}::[0-9A-Fa-f]{1,4}:|([0-9A-Fa-f]{1,4}:){1,5}::)((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])))((\/((1[0-1][0-9])|(12[0-8])|([0-9]|[1-9][0-9]))))$/;

/**
 * Validator factory for a IPV6 address.

 */
export const ipV6Validator = (options: {
  zeroCompression?: boolean;
  cidr?: boolean;
}): ValidatorFn => {
  const match = (i: string, r: RegExp): boolean => !!i.match(r);
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value ?? '';
    let valid: boolean | RegExpMatchArray | null | undefined;
    if (options.cidr && options.zeroCompression) {
      valid = value === '' || match(value, ipV6ZeroCompressionCIDRRegex);
    } else if (options.cidr) {
      valid = value === '' || match(value, ipV6CIDRRegex);
    } else if (options.zeroCompression) {
      valid =
        value === '' || (match(value, ipV6ZeroCompressionRegex) && value?.split('::').length <= 2);
    } else {
      valid = value === '' || match(value, ipV6Regex);
    }
    return valid ? null : { ipv6Address: true };
  };
};

/**
 * Validates a IPV4 address.
 */
export const ipV4Validator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = control.value;
  const valid = v === '' || v?.toString().match(ipv4Regex);
  return valid ? null : { ipv4Address: true };
};

/**
 * Validates a IPV4 address including CIDR.
 */
export const ipV4CIDRValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const v = control.value;
  const valid = v === '' || v?.toString().match(ipv4CIDRRegex);
  return valid ? null : { ipv4Address: true };
};
