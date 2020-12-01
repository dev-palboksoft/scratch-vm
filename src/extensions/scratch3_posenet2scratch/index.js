const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const ml5 = require('ml5');
const formatMessage = require('format-message');
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAJ1VJREFUeNrsnV1W28jWhivf6vvjjOA4IwhcnOuYEQRGgBkBMALwCIARYEYQGEGU63MRZwRRj6Dd92et/rRhixQE26ofSVXS86zlBd3BslyS6q1376pdxgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIyZdzQBQDr8898/JtWPvepV/9zFunqt5Oe7//xvRQsCAgIwDrGYVj9m1eujisUswmFLFZQf1auoRKWgpQEBARiGaBxWPz6rWEw7+lgRkYfqdV8JSslVAAQEID/RkJ+Tnk9H3MkdYgIICEC6oiFCcVa9jjt0Gq7cV68bwlyAgACkIRwiFqfVa56A22iKCMgCIQEEBKBfx3GakXAgJICAAPQsHiIcFxkLx2sktHVOjgQQEID2hEOm3l6ZONNvU0PWl0h+5JIrDQgIQFzxuFTXMXRk1tYJixQBAQEIFw4JU30ZqOvY5kYkpLXkDgAEBMBPPCRk9dUMJ9fhyrISkRPuBEBAANzEY179uKUlHkNaB5WQrGkK+D+aAGCneFwiHs88ujB1Y4ADAYAt4iHCMaclfmOtToTkOgICAIgHIgIICADigYhAB5ADAfhdPM4Qj8Y8TmvW6c2AAwEYtXiIcJAwd4fZWTgQgFGLR12aBNyh7RAQgNGKR73CnFCMP3MN/wECAjAqJGw1pRmCuWKNCAICMCb3IaPmQ1oiGiTVERCAUYiHuI4LWiIqtCkCAjAKJHTFaDk+Z5U4z2gGBARgqO5DwlZ0cu3BrCwEBIAODrzY03U1gIAADMp9XBpmXXUi0iTUERCAIYmHdGintEQnSFuzNgQBARgMZ4bEeZec4kIQEIChcEwTdO5CWGeDgADkjSZ1p7RE57AuBAEByB5yH/0wZV0IAgKQs/sQ50Gdpv4gdIiAAOA+wIs5yXQEBCBXSORyDQABAXBDS4xPaYne+UwTICAAjHzBhxlNgIAA5MYnmiAJJszGQkAAGPkC1wIBARg2jHhxg4CAAPjC2g+uByAgAF58pAmSYqKLOgEBAUgeOiuuCSAgAF7MaAKuCSAgAACQCH/QBDBkmIEVnZW+1uoifBPizMRCQABgJNxXr/N3//lf+Uqgp9WPK8NK/1FCCAsAdnFSCcfRa/EQ5P/Jv8nf0EwICMDQmNIEQSwrgVju+iP9m2uH41LWHQEBQEAGjOQ5zh3+fqHvaQKLCREQABgwReUsmgqC0b+9p9kQEACAHx7v+ZNmQ0AAhkJJEyTZ3iuaCgEBQECGy7883jNt+HdrmhcBAYDh4rO2gy1rERAAADP9579/zJv+cfW3IjjMrkJAAIbBu//8r6AVgriqhGGnKOiK9FuH436jaREQABg2suDv67aaYvpv3w2LA0cHtbBgDIgLmdEMwSIi7Xhnfk1MENdx7Nm2OEMEBCALSpogCrOIQsw1GQCEsGAMsLgtMd4qzAgICECKFDQB1wMQEACf0S4dVlowAwsBAWDUC1wLBASAUS/gCAEBAXgTyoxzHQABAfAa9Ur115KW6J0HmgABAWD0C1wDBARgNNzQBP2Kh8sOh4CAACSDLl4raIneuKMJEBAAOjFwpawEnPAVAgKQtQtZGpLpCDcgIACekAvpFsl7XNMMCAjAEFga9uTuVLBJniMgAINAO7MFLYH7AAQEwEdEpFMraYnWWeA+EBCAIXJCE7RKqUINCAjA4FxIYVgZjUADAgIQ0MkRYonPNVV3ERCAobuQNSPl6JSGSQoICMBIRETCWEtaIp6rI3GOgACMifPqtaIZglkQuhrR4IsmAHjin//+sVf9+Fq9JrSGF1Jt94hmwIEAjG809bTpFPkQP2g7HAgAVE5kXv24pSUaI/mOD+Q9cCAAjKqeKvYymm4uHgeIBwICAC9FhKmozcSDyQdjfU5oAoDNEM5CPAAHAhDiRAhnvaREPAAHAtDciRyqExn7FN+VIecBCAiAs4jsqYjsjbQJlpVw4MbgmT9oAhixIEyrH9NX/3v26r///cbfjA1xG+cazgPAgcAoO/4ZrefM4wJB8h2AgAAdP7i4DtnL/JKmAAQEYouA5AEmdPyDRKoTS8iqpCkAAYEYonFavQ4N+YAhUxiq6QICAhGF46J6zWkNhAMAAYGm4iGicWVY9zBkltXrDuEABARiisctrmOwyGyqO/O0poPFgICAAOIBW5Gk+DfztOFTSXNALFhICLZ4zBGPQTgMEYkf1asgPAU4EOhCPKbVj++GnEcuLCzBkFBUibsAHAj0BYUCX7I0VoJZ62DJNObTVNqJRX6AA4EU3Mes+vGVlnhk6z4XVVtNtK32EjjPfVwH9An7gYBw7Pk+6WQL/Tl48dBR/+PfJPCdRcguuHUBBwJ9uo9p9eOnYyd7U72u7WmgOjI/y7xTk/Id1y21W1sckCgHBAT6EhCXabs7R+iaK/hq8sunyHf74LI2ovquX8xTXqRPVtU573MnQx8Qwhq3eEwcO8Cd25jqvx9l2Bwrj4V13xI47z2dfg3QOczCGjdnDk5h2XRPCAmpVJ3avqMLWWe450Qq53tVtfc9K8sBAYEuOXX42xuXA49oA6KleSpbP+3xHOr80yW3NHQJOZCRomGPWwdBeOfxGVl1aCHrKjT3I0LySX/65IDWKkgP5mk1uRxDjntsmu2t8oFpvYCAQBcC8tNl1OwpIP9k1ixH1fe8b/jdpHOfblkvUi88/NSw85fjHGwKQ1XHOzS7F3tK6ZID7m5AQCAZ96G8d42xZyggMnrfb/I9rRlY8p7CPCXUi00OQBdrflYx2XMRj1ei9H3HqTGtFxAQaFVAvhr37WYbj86tEfOXDJtnZ2e+Y+qzCMi9JSjrDe5lpu7kUD+vbNiul2b7WhupifWBuxwQEGhDPKTj8ilb4hQe8RSpVHhzTYi23ZVxK2NSr9Z/iOEMVHz+2vFnC+pkAQICbQhIyOK3Riu1PUNkSQlI9T3fWyP+TyoaMRZHFubX3hwrz2u4S5ydF0UC+MBCwnGJx9SErZz+1OAzzjIXj7qTr6lnQMVaWS/HkhDU96qt/tK8Rmwm6pQAWoV1IOMitE7VzSshkrDWSjvBPT3+dADt9KDfc6/l7zMx7ZV8mVfnz37ngIBANPcxDxmVW53RRX2s6rhDbK7Ccgtt4yNQTV3LxSs3BRAVQljjYR74/ptIQpQ69s5+nzr4PKdS+ppfaupaZtTJAgQEQt2HdDinAYcorSm8pwNvLnvE3oUDmWneqOl1dA1DXuj7ABAQ8HYfIZ3IwurAhj6irfMfM9NdSfqrhk5BEuNTx2PL35/xCAACAr6Euo+l/u5SvTd3BzLr+HNvZYHiW27B+n93nse+0NAjQFRIog8cHdmGdB43kYQoBrJuwl7bIL//eONvpsZvGqu9J8jnnpziuXXdJD8iCXMJH55omXz53WcqtrTHEU8EICDQlfuoq8O6Jm+3jey3dfwvxCFgod2l5zk+WCP+vR6ulS1gdgVee0ruufFbl3IoYTmm9QICAk070llgR3hjdWgha0hkM6qTDr+67+ypunOd9eiwzIZzeJySKzPEqut643k9ZIEndbIgGuRAhk1Ipy/CcW25j2mIEHX8vb0EwBqdf+rpen2zhP+372Ql2uW6lB7Hnzad8QWAgIzbfewFjqTtLVJDwmBFl7sTahVgr+9r/X7Y02Xb5YAep+TqdVn4DiqY1gsICOwiNOG9sEbDe6HH6RBf91CP/qemn3IsTRYwynmdqVtaGr9V5tTJAgQEto7CpaOZBxxiaXVmIWGwsoekra/rKgLfH8t97DqHU2tK7rnnZ81bKuIICAjgPp7LlswCO9RO3UfA7Cl7xlff+Y9d5//sIPScl56fhwsBBATe7ERD3IedszgOOI69ADF195FD/sPm0Eq0iwvx2fdjFpAvAkBABkroavE69zENFKKbHr57aP4j1qZRPmJbOn6H2oWsA9r6ioQ6ICBgEzpjqh4Jh04BXvbw3X1H1C6j/zbdh8s57NXTenX72tLjc6eGOlmAgICOoOeBI+i7WO6j6+1UA2ZPdV2+/S1+eDog20H4JtRPqZMFCAiEugY7ZzEPPI8+3Ieve8gt/2HzXN5dy+0XHp/NtF5AQHAfjwnRkJGkXbI9JAxmTwHuktD8x6ynSxc6A+zMchC+5WIOe/z+gIBAAqRSsn3R0/f37QDrUfvnns67iPAdbtWFiHBfex4DFwIIyEjdx8yEJYDvIglR0Yf70NzB1PN814GddygxZoDNLAchAu6Tf9qjThYgIOMkZL3G66KJY3IfdefdV/l224GEfn7tQqiTBQgINB59y8h7HnCIWCXbix73msi1fHvMFfDPlXarY/pW650E3gOAgEBmhD7wsUq23/XYBj4CsLYEL+f8xyYH4ZtQP6NOFiAg43AfoWVLlq92wPOlj7IldRv45g5id94+xK4AbNfJku9373kcEuqAgIyA0KSnXbJ9FnqcjNxHG513iAOJKWB2pV3fxYXUyYJGsKVt3u4j1nqN0LIl9z02hW/4qY3O24kWKwCLgzjQ7W8Xntf3qufr2oVzlYGD/Py3/m4PJgq9t2Wg0emmaAgIdIGMEGOULQndubDzsiURHEhpdQhDyX/85iB0dfq1DjRc7xVJyl9qna1cRaIWBGnff6lYNHWcM+s5k2PJYGvRV6gWAYHYxJoxFeJinqcA99RB+Ha8bXbeTWk7hPboIETcq8+QUNatxzGkTlZflQVcnPievibq5tqYli3X6Lb6PHnuTnqccYiAQPBDMzdxypbIMeYBx7nP0H3YnXdf5dttEWtLwJ4dhIyaq9+PjX+trZME7vmZ5R4+6rn1If7y+V9FlHW6NAIC2RHiGlaRSrY/C1GP5Lr+w1jXoM0KwLaDWHh+X0nK33Ux4rYEXc6zzkv0KfJbHV51vh+rdjkxIwYByc99zALt+Y1l/UPcR6+hDT1/nw5xZZ13CvmPNtdcPDsIEQARE89rLuGw/UjXbWpeJq9d8hKpIeL6Z855IgRkfMQq2R46Bfiu53bwdQ9FhGOE0mUJFdtBiAvxmXzxuHlV0wSy9b1qYWgrL5HE81h932KsOREEJC/3MTUR1mtEmAKcwgMTWr69z3UORccCdqHXTKb13ngOQiRk8yLnpW54Yl5OhZ2N8NGU5Pp+z/lABARadR/riCXbbxJoC6+OSqe2hghQMB3lP160leUgJPF7bNxDRnK/fKmOY0y6eYlQpH1u7DUfOtA43XG/TfWZuhxbh8RK9LzcxzxSpx9atuS+57bwDYcUoQIU0X10fQ6P29/qKNl7hbq+hiYe0iay8PLk9YJBuder14HZPRPt1IwQBCQfoqzXiDUFOEf3YdIo377q6RwmOkoO2f52qOxc16HubZvwTsZY/gUBycN9hM6YilWyvUxkJa7v7KnaOfX5oH/r0QFdWNvfnvNkPbJs6qh13UfRwn2JgECrhOYslipEofum3yXSHj6d77rF2lMuFD2fQ12td1XfFyPnIeIzMLoy+AhIHoTkLOz1GtmWLbHc2NRTBItAAYrBKmAL3VjF/A6tEjDnxm/72yEg7Xnvkc+7R0B+wSysxIlYtmQW2HEuE5mm6PsdUirf7tPZ3OhAIob4PS4M1DpZvtN6c6DUl4jFn/qzDFkAq21Gx4SAZEPIw30fqWR73YGlgG/oJ5n8h2cRyEJfPyOchywMPJOYvqyi1jpZ04yfkUKFwhaJVsqvs2c8ApKT+5gFPtg31qg71H2UiTSLjwDYo84U8h8z3/MP2N/jt4GJ1sl6nMJqnnJEa2u6uE8J+DYRQaj353h2Fk1d8ZbS7ueOYSw22kJARuE+igEVTaw7gZy3r7U7u08B5++7v8dr1nqMtT040N/FlcjnfDXdxvWfhaF6/V07i6aDF88SKsfGbeOsYwMISCbuI6Szi1WyvUjIffi2hx066rt8u8/3eLA6+JD9PWzx2Fp6Qz9HnMl3Ez+8Veg5/KidhUtpnA27CfoOLg6b1vmSsN+Oa1eakYGApEvoavFBuQ/PkXvNfc/u47WIhYiPCdjfo+aoSehHReREnYiz4zK/Qk5r/W+fkFMXVXtllf56WyhLJ7NcuVwnBAT6ch+hrsEumhgSs10lVmV05vkdfENHMVl5fodNne4ioD0aX1MtA19u6LhrYZB//7N2Fi4J7Dc2iqpFo0vqOl/iQnxqYf3mFBEQ6JOYJdtzL5pohy288x8B+4fEICSJX2zp2JceA40Hz/tAzvuHikXpEXLKYaMoacu55zTddd814hAQ8HENxasReqyS7amULanxdVIPAe4lFkWAi/q25d/Ojd/+Hk5oCY/rBvft673Jpybv6cFZDrYQkHHTxDWs9Ya9frU/w+TVaCqkY1kk1i5e4aceSqdvFIEY+Y9X363zhYCv9gDpc2/ylChNAlUaEBDcRxPXUJeeXr3VoYR2uNZnpGbHQzvfFByI6zkUu5LOHgsBP3ncl7ddOJ2MOR/jZlICtbDSoslDetAwSbkw/nWOblJ6IDxH7sKDvn9q+qtTZOc/Pvo4lyYdmIsQWxV5m7Z9qJsdMosx5j4QkDTZFYpYNp3hon/nG5dNzY77CkgR+P6Y7sPLgTS81q77e7isIbnisdz6PF6OuQEQkLRG2btGhq6CsPR8KFKz4z77LKRSvr3OfzjPOnKcQn3i8LfiQm631XWSf6teX8wIK8w6OI+TsTcCApJRJ+laIE5DJ65ikFTyPPPta0NcUOFxrV2c47x6fZcFcraQqHA8/puh7tNbSDsfjN151JBET4dZizd80w74PqGyJaHt8mCN/Kc9nfs6YP2Hz3qNhXHLV0i7SDhL3Eg9OMFxbH6OFolNbUdA4JmdD66MDj3CSy4dQopz2X3DT74j/zbcR+sORF1ISJ0shOMldimW+7bKwyMg0CUSUmg8AtIyDI07rMTKloQ4kFTKt/vmP9a+HZbWyTpFEBq7itK8rP67RiwQkKzQDqYJp8YtMe6yEv0mwXaJkf/oM47v64JChVxcyFeerBftKUJRbzi1TnSwhICA16hx1bD+juwkd9kkgdeg9PTrEXuKc9mDypcErB+JQcgssG+B95NvnaycqYs6/jAeG04BAjIWZCe5f1UPxvkO8XCZv79I9LsOJf/h6qJiiPm5fv/pgO79WhjsEvFlghM/EBDo5eFo+rCfaX7jRkdZhYbBpMM4dew01gnPLPERAHvU+bnHc6/zH1PH6xGlQ9SE+pF5CmXltIr8ee8QQ14CAQGnEatLyGFauwzP8tM1SVYR9eh4a+rwlW/+JLYDmXm+LxgNjR4kKiKFCdiVEBAQ+H3EOu/4M+UBTrWK6MzzfUXg+6O0a1/5jy0ictuDoNpTYUtDXgIBgda4V0fR5UhxmfDDnHP59iJACKOPwlXM9mUChnkKcca8x56Fwfya5UReAgGBLuljbweT9iY4PjOw7gPfHwsJy/SW/9hyj0npd3GcMsnCpQR88Na1gIBA+1y3MELc+FmpjhIDtq/1TVy35UBc3UfrU6nVcYoTudR2mm1oq9I4bl0LCAj070J8S1G4hh0WCTfFzPN9ReD7Y13H+jx6zX80OE+5D5Y8eeAL1XjTE5Flyw+1jECPEk9k+uQvUinfXgQIIaN9QEAgWEROWhSR8wxi1z4OIpX8h28YjdlJgIBAsiIindN+6uWotfxISP7DN38S24Hseb4PAAGBaCJyZPz3Nrc7p/1MZs3MAr5jyPtjXbP6PJLOfwAgIOMQEQnNfDBPSW9XIZHOTHZPO8hoXr5P/sKe/tpn+ZLCVwgTLWYJsBVmYeUhIvbUy0PtJPfM72GSer6+lPO4z3Qxl4+DuI/gYGJQh9Fcy6gU3OWAgEBXjmSQo9WA8uvfAt8f24HMfM4fIDcIYUFK+IafisD3x8J3GjEOBBAQgEB8HERhTX/t04GsfM+D1d6AgAAEEFB+/Vvg+2NReJ4HyXNAQAB6cB/PHXfP7uNZyAz5D0BAADrHt3xJLSB95z/q82ABISAgABk4kCKCg4mBnf9wEUJKogMCAhCC1o1qMnJfmqdCkO+qn++r17n1/mkC7sNVyHAfkDWsA4Ec3IeM7g/s0bqO+O2V+SvTXxLddx3KA5cecCAAYXxyEY/X6Ir7A/NrHUZfDmTm+T4ABASgBQfSqPy8OpKTHs7dN//BvuGAgACEsCN/sXYpP69Cs+z4K6waCiHuAxAQgMhcRO5ku15X4Zv/YP0HICAAge5jvuVPfngctuz4axQe7kOY6qp1AAQEILL7EP7tcUzplLvaGtbOY3zy+O5/VSLypXrNERPIkXc0AfToPn426KA/eB5/pq7gk2lvkeFSd42Uz/snwvGkLla9lwv7owMCArChg78128NXNQcxqtXqRly1mISsF5GkuZzP3+apEnCh+7B/j9xEiAkgIACe7uPZhZin/dzXDY77xTzN6JIO/pt5Werd/ruJCsln/TlteB4nb4mZfh8RkLbCUIgJICAAju7jedRfdZz7nse0xaTYImgzdSiHbwjBSp3Qesvny3u+mvZXwyMmgIAA7sOBjbkQzXVcmOZ5jntLUFYbjrlnCcqeikfZ8Lu16UQQE0BAAPfh+DYJHS11lC/iI51lqZ17SGe9VofyoIJSRvh+l2b37DLEBBAQgA7ch6xGf99R51yaXyEvr47Y8zsiJoCAALTgPhZVJ3ip75eOedrhKe/MvWz4nv8k1OyICSAgMEr3IbyXjk8W21W/33b+gDztPZKzgCAm0BqsRIeu8Ak9La2O7rQn4Zs4/v004WtwqCLMCnhAQCAr9zH3eOtC3z8z/W0WdegjfBlclt/EhDsVnB06TQAdCIhP7kPCLEf6/i+eHXkMStNwIeMbzkXO+dj0u1+7C/IdH8Nc1fe9584FBARScB8+uY8DLRPi+/6YPNe82vFdz8wb60v0O4iYSBhuipgAAgLQnvt4nv3k+f42KMzTepRyg0iKS6rDbCIgd+qiyld/u6euRL5TLvkHxAQQEMjGfdgLB/9K7GvVK9lXKhh1+ZNtf//mzCct8PjZvF0+BTEBBARwH45vey5b0uOq7k47Xitf8tn0l+tBTAABgezdh71w8K+MRuauHe+yet1tyZccm/5mnvlQ6rVbcvcjIAB9uA/pWD/0uXCwp473xmzPl4igTDP5PoXZkCsCBASgTfdxXXU853qMWGVLlupicggNSedbJ99zzpfIuR9sqnYMCAhAbPdh1H2UunDwa4zRvZVPyS3PIMKXc74EEUFAADpzH/b+4iIeswinc/JWTD6zRX4550vk3PcJZyEgAG27j4PI+4tv3IQqs074xXcy+eVLZGHlAU8GAgLQlvt47mQiLhw8cZ0RlJmYFCaffMkJs7MQEIC23Ee9cNBXgLzcx4DERDrnlPMlwdcDEBDAfWztXCIuHIw64s1ITFLOlxyx2BABAWjLfdT7nYeGXFod7WYkJqWJny9ZqUgJM8fzea6uDAgIQAz30cbCwc7i7RmJSWHC8iWyL8u1/V4VfKk+fOog+u/ZCREBAYjlPmLvd95brD0jMRFxfbN2lYq4nS/ZuZZD3czXhiJCMh0BAYjiPoz5tXAwO/cxADGpCyHevJEvmeiAoGiyENBh6jVhLAQEIIr7iL1wMMmZPpmISWmeQlxL30V/DvcBYSwEBCDYfcgK5VXEsiXJh0cyERNxHHXyfe3w3Zq6EMJYCAhAkPuIvXAwu3UGqYtJ1Z7vPL7TPw3+jDAWAgKIR5D7iL3fedaj2gTFxEuQGwqIlzhBmvwfTQCe+C74k86p0N9PI3V2y5wbUvIO1eta94GXjltK2vdZxXbqIR4Th7895PFBQGDc7mPu+faF1eHMI5zOYlAhgUTExKOTd/n7zzxFCAjgPlxZW25BFqHFWHW+HGojvyEm1+ZpxlQXnLZ4T+BAEBDAfThzY/1+jPtwFpNzzU3sdyAmM12f0+SekIkQU4djTwhjISCA+3DlWjucuYmz6nw5xgsg0587EpPb6lqd7RCPK88BBWGsIdyLNAE4ug/fWVP2wkFZLxA624j1BL9fn7Y2lSrV7a309716IkTANGwJZ77nqiEgMJ4OKmTNRsz9ztlfoj8xqXksz66hqC8hx+Bq5QshLHBxH77iYZcUjzF1d8EV2TEybD/M9Vk/RwRgHXIMQEBg+ITkPm4sEQpNnpaErpIQE/s63kc4BiAggPv4jZW1cDDGboO4j3hichJwKHsm1UOEYwACAriPje4jxsJB3EdcMZG2DKmMSxgLAQFozX2UrxYO4j7SIySJTRgLAQFozX3cWb+HJs9xH+3wEPBewlgICEAr7kNCGvbCwdCyJbiPFggMPwmEsRAQgOjuY2ltSBSaPMd9tAthLEBAIBn3IdTJ85kJX8iG+2gXwliAgEBS7qPEfeQBYSxAQCAl93Gnx5FyGjPcRxYQxgIEBHp3H0XEHQdxH91BGAsQEEjGfYQeB/fRIYSxAAGBvt2H7RhCxQP30T2EsQABgd7ch122JDR8hfvoHsJYgIBAL+5DwhZLayQZsnAQ99EDhLEAAQFf9zEPdR8RFw7iPvqDMBYgINBYOPaql+wQeBt4qKUlRFPcR7akEMba4zIgIJC2cMiDelX9KvuTzxzfXpinvSRkm1rZFnnfWjh4jPvIl0TCWMdcCQQE0hWPQxUOnxLrshnRgbiEWjRkkyLbQeA+socwFiAg8JtwTDVc9cX4hZlEPK53jGBPAlwE7iMNvgW8N0YYa0oYCwGBdIRDHurL6tefxr+0SLFLPCwRkc8qcB+jdCACYSwEBAYiHiIYEq4KnRl10/Lf4z4SQWfTEcYCBGTEwiFhAAlVSchqGqFTuW/x73Ef6dH3bCzCWAgI9CQel+o6+h7FlbiPbCGMBQjIyIRjVr0kzyHhqkkCp9TE+eA+EoQwFiAg4xGOScxw1YbPOHT8+6bngftIF8JYgIAMXDxkLcfPDkZrpy38Pe4jbQhjAQIyUOGQcJXkOWQ1eRfhqtLh3GTU2GSRIu4jYQhjAQIyPOGQ0IDUrZJwVRf2XlaZH+gCQbMrpKD//hX3MRgIYwECMhDxqMNV8w4+TkafsvJc6lwVVtHF7yJgr3Mc1mLFrw0dEe4jD2KGsUrPYxDGStWl0gRZCIeMwCRUNevoI5cqHmvdHEpmdb0Vkir1NXF0Q+I+PnBls7n/ZIKGbyhpXV3r93qcK+NXf437BQcCHg9uSMVcH57DVSoec3U8mx76qZ6Xa4gB95EXscJYd57HIIyFgICjeOzqvGOyKVx1a+In6Ml95EesMNbKEMZCQKBV4Wiz834L6cxlX4/rjhwP7iMzmI0FCEj6wjGxSpDMOvhI13BVDArcR7YQxgIEJFHxqDd4uujg47oMV73+3BOudrYQxgIEJDHhCN3gyRUZ/XcZrrI5sra9hcyIEcbSGX0hYkQYCwGBSBs8udBHuOqF8xC3w5XPnqAwliUAhLEQEPAUj5kZfriqplThWnLlBwFhLEBAehKOadsVc18hnXZf4SpBtr/d184CBgBhLEBA+hGPS9PdBk99hquEQoXjXDscGBYPge+PEcaachkQkDEIR5cbPPUdrqpzHQe4jkGTQhgLF4KADFo4JiMMV30g1zF8EgljkQdBQAYrHl1t8CT0Ha6qP59w1bj4Fvj+0DDWHmEsBGRowtHlBk8phKueP5+rPzoIYwECEkk4ut7gaWn6DVc9fz5Xf5zogtCQPBdhLAQEOt7gKZVw1QnhKjD+4afXDoIwFgIyOuGoQ0ZjCVctCFfBKwhjAQLiKBxdh4zkId3vMVxVf/4lVx9sCGMBAuImHnPTXchIHk4JFz0WILSq9XYVrnrx+Vx92ABhLAQEdghHlyGjOlz0QcNVXVfrffH5XH1o4FBDIIyFgAxWOLre4Ok5XNRDtV6hMISrwAHCWICAvC0eXW7wJA/hW+Gqi46+rnz+kZYgKbn64AhhLAQEVDi6DBn1Ha4SFuo67rn6EOCcQyCMhYAMQjwuTXchoxTCVSJcl6zpgBAIYyEgYxeOiY78xxCuErEgXAWxIYyFgIxTPMxTCZK2R/4phKvqirmEq6ANRx0CYaxcHejIBcRXPOQmL6rXn/rfH7fcwPJwnavjEME669BxGD3Pc/bogJafJXHSIbXg3muJnivjt95pJdUSuBLd8seIb/hLD/GoncT1G8cTJ3FlCYmIzEm9nkLDVVcdOo66BMqS2xw64C5QQOT5WOpxfATkMYxFaBYH0oV4SCf+06ND3rnbno6g/q7XU+hn3ZruEuTCtQodCXJI+Zl64dQlN6jH+uk50DqnSjQC0sXNLh363PFtRy75g57CVSt9iApubejhuQoKY1X37Ts9jhxjoq/PDs8qYSwEpPWbXG7Kv1w7ZtcbM2AU5cPG0BpAh8+WDJiuPO/fk00DNBWU24bi9IEwVneMcRaWz2wNn+mFXd3ES8MGT5AGPrOx6tDw/RZn8rgXTcNnitlYCEirfPZ4j88Mpm8tf4/SsMETJITnosJFkxmCeo+fNDjeJ64EAtIms8zPn4q5kDIubr10cc56v+8Smz0uAQLSJj4l2X1uyjZGQmzwBKlz39Lf1jzs+PcplwABSQ2nsJcm6mM6HQkNsMETJI9jGOtvj49gQSwCkh2zShRcBCHm1F3CVZAbDy0ee0LzIiA58kWnE+5yH3MTZ+tZEYwPhKsgQ5qGpj56HJskOQKSJY+FF7UkySbxkM7+NvBzJARAxVzIFoeiiIcuVXQ1NHzY4PmBjhhjLSy5uX1nakzUiazUpq/0/9XFFKeB5yYbPF0zLRcG4kKaOHFZeHjU8JgXZncIixwJAtIqhQmf6rdn4k4XlHM6wXHAgGhaFFFcyK2sZ9rhPuYNj/eNpu/QbY7tC2se43sip0PFXBjys+ZSzqcwb2w78EaV611QygQBSerGbgsq5sLQnzNxDa45wdL8ymNMHJ3+c0VfQEBSu7Fj8eZIC2CAz9lE3X5Xg7V9nqtuGeUsLA0ZFR1/bF1x9ICbHEbynD2GaLty9DxXCEiXnGin3gUiWB/IdcAIReRe7/82EeFY0No9XN+RW+xZ9eNryzc2GzzB6ImwZ/o2Z4+rx4H0MjoqWnIi9eyqfcQD4BHZzyP2s1AiHjiQFEZHMjL6YuIk+5YqHsyuAvj9WZMpubFK/RzxnCEgqdzYMmPkIuDmJlwF0OxZm+mzNvN0HQvyiQhIqje3uJB59Tpu6EgkSXi3bUtOANgoJPKcySLBSYPn7AHhQEByE5PZBiERp7HCQgNEedb29Dnbe+U2Slw9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApMn/CzAAWbLd4eVcO4YAAAAASUVORK5CYII=';

const Message = {
  x: {
    'ja': 'のx座標',
    'ja-Hira': 'のxざひょう',
    'en': ' x',
    'ko': ' x',
    'zh-cn': ' x',
    'de': ' x',
    'es': ' x',
    'ru': ' x',
    'sr': ' x'
  },
  y: {
    'ja': 'のy座標',
    'ja-Hira': 'のyざひょう',
    'en': ' y',
    'ko': ' y',
    'zh-cn': ' y',
    'de': ' y',
    'es': ' y',
    'ru': ' y',
    'sr': ' y'
  },
  peopleCount: {
    'ja': '人数',
    'ja-Hira': 'にんずう',
    'en': 'people count',
    'ko': 'people count',
    'zh-cn': 'people count',
    'de': 'people count',
    'es': 'people count',
    'ru': 'people count',
    'sr': 'people count'
  },
  nose: {
    'ja': '鼻',
    'ja-Hira': 'はな',
    'en': 'nose',
    'ko': '코',
    'zh-cn': '鼻子',
    'de': 'Nase',
    'es': 'nariz',
    'ru': 'нос',
    'sr': 'nos',

  },
  leftEye: {
    'ja': '左目',
    'ja-Hira': 'ひだりめ',
    'en': 'left eye',
    'ko': '왼쪽 눈',
    'zh-cn': '左眼',
    'de': 'linkes Auge',
    'es': 'ojo izquierdo',
    'ru': 'левый глаз',
    'sr': 'lijevo oko',

  },
  rightEye: {
    'ja': '右目',
    'ja-Hira': 'みぎめ',
    'en': 'right eye',
    'ko': '오른쪽 눈',
    'zh-cn': '右眼',
    'de': 'rechtes Auge',
    'es': 'ojo derecho',
    'ru': 'правый глаз',
    'sr': 'desno oko',
  },
  leftEar: {
    'ja': '左耳',
    'ja-Hira': 'ひだりみみ',
    'en': 'left ear',
    'ko': '왼쪽 귀',
    'zh-cn': '左耳',
    'de': 'linkes Ohr',
    'es': 'oreja izquierda',
    'ru': 'левое ухо',
    'sr': 'lijevo uho',
  },
  rightEar: {
    'ja': '右耳',
    'ja-Hira': 'みぎみみ',
    'en': 'right ear',
    'ko': '오른쪽 귀',
    'zh-cn': '右耳',
    'de': 'rechtes Ohr',
    'es': 'oreja derecha',
    'ru': 'правое ухо',
    'sr': 'desno uho',
  },
  leftShoulder: {
    'ja': '左肩',
    'ja-Hira': 'ひだりかた',
    'en': 'left shoulder',
    'ko': '왼쪽 어깨',
    'zh-cn': '左肩',
    'de': 'linke Schulter',
    'es': 'hombro izquierdo',
    'ru': 'левое плечо',
    'sr': 'lijevo rame'
  },
  rightShoulder: {
    'ja': '右肩',
    'ja-Hira': 'みぎかた',
    'en': 'right shoulder',
    'ko': '오른쪽 어깨',
    'zh-cn': '右肩',
    'de': 'rechte Schulter',
    'es': 'hombro derecho',
    'ru': 'правое плечо',
    'sr': 'desno rame'
  },
  leftElbow: {
    'ja': '左ひじ',
    'ja-Hira': 'ひだりひじ',
    'en': 'left elbow',
    'ko': '왼쪽 팔꿈치',
    'zh-cn': '左肘',
    'de': 'linker Ellbogen',
    'es': 'codo izquierdo',
    'ru': 'левый локоть',
    'sr': 'lijevi lakat'
  },
  rightElbow: {
    'ja': '右ひじ',
    'ja-Hira': 'みぎひじ',
    'en': 'right elbow',
    'ko': '오른쪽 팔꿈치',
    'zh-cn': '右肘',
    'de': 'rechter Ellbogen',
    'es': 'codo derecho',
    'ru': 'правый локоть',
    'sr': 'desni lakat'
  },
  leftWrist: {
    'ja': '左手首',
    'ja-Hira': 'ひだりてくび',
    'en': 'left wrist',
    'ko': '왼쪽 손목',
    'zh-cn': '左手腕',
    'de': 'linkes Handgelenk',
    'es': 'muñeca izquierda',
    'ru': 'левое запястье',
    'sr': 'lijevi zglob'
  },
  rightWrist: {
    'ja': '右手首',
    'ja-Hira': 'みぎてくび',
    'en': 'right wrist',
    'ko': '오른쪽 손목',
    'zh-cn': '右手腕',
    'de': 'rechtes Handgelenk',
    'es': 'muñeca derecha',
    'ru': 'правое запястье',
    'sr': 'desno zapešće'
  },
  leftHip: {
    'ja': '左腰',
    'ja-Hira': 'ひだりこし',
    'en': 'left hip',
    'ko': '왼쪽 엉덩이',
    'zh-cn': '左臀部',
    'de': 'linke Hüfte',
    'es': 'cadera izquierda',
    'ru': 'левое бедро',
    'sr': 'lijevi kuk'
  },
  rightHip: {
    'ja': '右腰',
    'ja-Hira': 'みぎこし',
    'en': 'right hip',
    'ko': '오른쪽 엉덩이',
    'zh-cn': '右臀部',
    'de': 'rechte Hüfte',
    'es': 'cadera derecha',
    'ru': 'правое бедро',
    'sr': 'desni kuk'
  },
  leftKnee: {
    'ja': '左ひざ',
    'ja-Hira': 'ひだりひざ',
    'en': 'left knee',
    'ko': '왼쪽 무릎',
    'zh-cn': '左膝',
    'de': 'linkes Knie',
    'es': 'rodilla izquierda',
    'ru': 'левое колено',
    'sr': 'lijevo koljeno'
  },
  rightKnee: {
    'ja': '右ひざ',
    'ja-Hira': 'みぎひざ',
    'en': 'right knee',
    'ko': '오른쪽 무릎',
    'zh-cn': '右膝',
    'de': 'rechtes Knie',
    'es': 'rodilla derecha',
    'ru': 'правое колено',
    'sr': 'desno koljeno'
  },
  leftAnkle: {
    'ja': '左足首',
    'ja-Hira': 'ひだりあしくび',
    'en': 'left ankle',
    'ko': '왼쪽 발목',
    'zh-cn': '左脚踝',
    'de': 'linker Knöchel',
    'es': 'tobillo izquierdo',
    'ru': 'левая лодыжка',
    'sr': 'lijevi zglob'
  },
  rightAnkle: {
    'ja': '右足首',
    'ja-Hira': 'みぎあしくび',
    'en': 'right ankle',
    'ko': '오른쪽 발목',
    'zh-cn': '右脚踝',
    'de': 'rechter Knöchel',
    'es': 'tobillo derecho',
    'ru': 'правая лодыжка',
    'sr': 'desni zglob'
  },
  getX: {
    'ja': '[PERSON_NUMBER] 人目の [PART] のx座標',
    'ja-Hira': '[PERSON_NUMBER] にんめの [PART] のxざひょう',
    'en': '[PART] x of person no. [PERSON_NUMBER]',
    'ko': '[PART] x of person no. [PERSON_NUMBER]',
    'zh-cn': '[PART] x of person no. [PERSON_NUMBER]',
    'de': '[PART] x of person no. [PERSON_NUMBER]',
    'es': '[PART] x of person no. [PERSON_NUMBER]',
    'ru': '[PART] x of person no. [PERSON_NUMBER]',
    'sr': '[PART] x of person no. [PERSON_NUMBER]'
  },
  getY: {
    'ja': '[PERSON_NUMBER] 人目の [PART] のy座標',
    'ja-Hira': '[PERSON_NUMBER] にんめの [PART] のyざひょう',
    'en': '[PART] y of person no. [PERSON_NUMBER]',
    'ko': '[PART] y of person no. [PERSON_NUMBER]',
    'zh-cn': '[PART] y of person no. [PERSON_NUMBER]',
    'de': '[PART] y of person no. [PERSON_NUMBER]',
    'es': '[PART] y of person no. [PERSON_NUMBER]',
    'ru': '[PART] y of person no. [PERSON_NUMBER]',
    'sr': '[PART] y of person no. [PERSON_NUMBER]'
  },
  videoToggle: {
    'ja': 'ビデオを[VIDEO_STATE]にする',
    'ja-Hira': 'ビデオを[VIDEO_STATE]にする',
    'en': 'turn video [VIDEO_STATE]',
    'ko': '비디오 켜기 [VIDEO_STATE]',
    'zh-cn': '打开视频 [VIDEO_STATE]',
    'de': 'Video einschalten [VIDEO_STATE]',
    'es': 'encender video [VIDEO_STATE]',
    'ru': 'включить видео [VIDEO_STATE]',
    'sr': 'uključiti video [VIDEO_STATE]'
  },
  on: {
    'ja': '入',
    'ja-Hira': 'いり',
    'en': 'on',
    'zh-cn': '打开',
    'ko': '켜기',
    'de': 'ein',
    'es': 'activar',
    'ru': 'включить',
    'sr': 'uključiti'
  },
  off: {
    'ja': '切',
    'ja-Hira': 'きり',
    'en': 'off',
    'zh-cn': '关闭',
    'ko': '끄기',
    'de': 'aus',
    'es': 'desactivar',
    'ru': 'выключить',
    'sr': 'isključiti'
  },
  video_on_flipped: {
    'ja': '左右反転',
    'ja-Hira': 'さゆうはんてん',
    'en': 'on flipped',
    'ko': 'on flipped',
    'zh-cn': 'on flipped',
    'de': 'on flipped',
    'es': 'on flipped',
    'ru': 'on flipped',
    'sr': 'on flipped'
  },
}
const AvailableLocales = ['en', 'ja', 'ja-Hira', 'ko', 'zh-cn', 'de', 'es', 'ru', 'sr'];

class Scratch3Posenet2ScratchBlocks {
    get PERSON_NUMBERS_MENU () {
      return [
          {
              text: '1',
              value: '1'
          },
          {
              text: '2',
              value: '2'
          },
          {
              text: '3',
              value: '3'
          },
          {
              text: '4',
              value: '4'
          },
          {
              text: '5',
              value: '5'
          },
          {
              text: '6',
              value: '6'
          },
          {
              text: '7',
              value: '7'
          },
          {
              text: '8',
              value: '8'
          },
          {
              text: '9',
              value: '9'
          },
          {
              text: '10',
              value: '10'
          }
      ]
    }

    get PARTS_MENU () {
      return [
          {
              text: Message.nose[this._locale],
              value: '0'
          },
          {
              text: Message.leftEye[this._locale],
              value: '1'
          },
          {
              text: Message.rightEye[this._locale],
              value: '2'
          },
          {
              text: Message.leftEar[this._locale],
              value: '3'
          },
          {
              text: Message.rightEar[this._locale],
              value: '4'
          },
          {
              text: Message.leftShoulder[this._locale],
              value: '5'
          },
          {
              text: Message.rightShoulder[this._locale],
              value: '6'
          },
          {
              text: Message.leftElbow[this._locale],
              value: '7'
          },
          {
              text: Message.rightElbow[this._locale],
              value: '8'
          },
          {
              text: Message.leftWrist[this._locale],
              value: '9'
          },
          {
              text: Message.rightWrist[this._locale],
              value: '10'
          },
          {
              text: Message.leftHip[this._locale],
              value: '11'
          },
          {
              text: Message.rightHip[this._locale],
              value: '12'
          },
          {
              text: Message.leftKnee[this._locale],
              value: '13'
          },
          {
              text: Message.rightKnee[this._locale],
              value: '14'
          },
          {
              text: Message.leftAnkle[this._locale],
              value: '15'
          },
          {
              text: Message.rightAnkle[this._locale],
              value: '16'
          }
      ]
    }

    get VIDEO_MENU () {
      return [
          {
            text: Message.off[this._locale],
            value: 'off'
          },
          {
            text: Message.on[this._locale],
            value: 'on'
          },
          {
            text: Message.video_on_flipped[this._locale],
            value: 'on-flipped'
          }
      ]
    }

    constructor (runtime) {
        this.runtime = runtime;

        this.poses = [];
        this.keypoints = [];

        let video = document.createElement("video");
        video.width = 480;
        video.height = 360;
        video.autoplay = true;
        video.style.display = "none";

        let media = navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        media.then((stream) => {
            video.srcObject = stream;
        });

        let poseNet = ml5.poseNet(video, ()=>{
            console.log('Model Loaded!');
        });

        poseNet.on('pose', (poses)=>{
            if (poses.length > 0) {
                this.poses = poses;
                this.keypoints = poses[0].pose.keypoints;
            } else {
                this.poses = [];
                this.keypoints = [];
            }
        });

        this.runtime.ioDevices.video.enableVideo();
    }

    getInfo () {
        this._locale = this.setLocale();
        return {
            id: 'posenet2scratch',
            name: 'Cubroid Pose',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'getX',
                    blockType: BlockType.REPORTER,
                    text: Message.getX[this._locale],
                    arguments: {
                        PERSON_NUMBER: {
                            type: ArgumentType.STRING,
                            menu: 'personNumbers',
                            defaultValue: '1'
                        },
                        PART: {
                            type: ArgumentType.STRING,
                            menu: 'parts',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'getY',
                    blockType: BlockType.REPORTER,
                    text: Message.getY[this._locale],
                    arguments: {
                        PERSON_NUMBER: {
                            type: ArgumentType.STRING,
                            menu: 'personNumbers',
                            defaultValue: '1'
                        },
                        PART: {
                            type: ArgumentType.STRING,
                            menu: 'parts',
                            defaultValue: '0'
                        }
                    }
                },
                {   opcode: 'getPeopleCount',
                    blockType: BlockType.REPORTER,
                    text: Message.peopleCount[this._locale]
                },
                {
                    opcode: 'getNoseX',
                    blockType: BlockType.REPORTER,
                    text: Message.nose[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getNoseY',
                    blockType: BlockType.REPORTER,
                    text: Message.nose[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftEyeX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftEye[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftEyeY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftEye[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightEyeX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightEye[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightEyeY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightEye[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftEarX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftEar[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftEarY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftEar[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightEarX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightEar[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightEarY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightEar[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftShoulderX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftShoulder[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftShoulderY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftShoulder[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightShoulderX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightShoulder[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightShoulderY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightShoulder[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftElbowX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftElbow[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftElbowY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftElbow[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightElbowX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightElbow[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightElbowY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightElbow[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftWristX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftWrist[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftWristY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftWrist[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightWristX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightWrist[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightWristY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightWrist[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftHipX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftHip[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftHipY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftHip[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightHipX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightHip[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightHipY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightHip[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftKneeX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftKnee[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftKneeY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftKnee[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightKneeX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightKnee[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightKneeY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightKnee[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getLeftAnkleX',
                    blockType: BlockType.REPORTER,
                    text: Message.leftAnkle[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getLeftAnkleY',
                    blockType: BlockType.REPORTER,
                    text: Message.leftAnkle[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'getRightAnkleX',
                    blockType: BlockType.REPORTER,
                    text: Message.rightAnkle[this._locale] + Message.x[this._locale]
                },
                {
                    opcode: 'getRightAnkleY',
                    blockType: BlockType.REPORTER,
                    text: Message.rightAnkle[this._locale] + Message.y[this._locale]
                },
                {
                    opcode: 'videoToggle',
                    blockType: BlockType.COMMAND,
                    text: Message.videoToggle[this._locale],
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'videoMenu',
                            defaultValue: 'off'
                        }
                    }
                }
            ],
            menus: {
              personNumbers: {
                acceptReporters: true,
                items: this.PERSON_NUMBERS_MENU
              },
              parts: {
                acceptReporters: true,
                items: this.PARTS_MENU
              },
              videoMenu: {
                acceptReporters: false,
                items: this.VIDEO_MENU
              }
            }
        };
    }

    getX (args) {
      if (this.poses[parseInt(args.PERSON_NUMBER, 10) - 1] && this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)].position.x);
        } else {
          return 240 - this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)].position.x;
        }
      } else {
        return "";
      }
    }

    getY (args) {
      if (this.poses[parseInt(args.PERSON_NUMBER, 10) - 1] && this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)]) {
        return 180 - this.poses[parseInt(args.PERSON_NUMBER, 10) - 1].pose.keypoints[parseInt(args.PART, 10)].position.y;
      } else {
        return "";
      }
    }

    getPeopleCount () {
      return this.poses.length;
    }

    getNoseX () {
      if (this.keypoints[0]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[0].position.x);
        } else {
          return 240 - this.keypoints[0].position.x;
        }
      } else {
        return "";
      }
    }

    getNoseY () {
      if (this.keypoints[0]) {
        return 180 - this.keypoints[0].position.y;
      } else {
        return "";
      }
    }

    getLeftEyeX () {
      if (this.keypoints[1]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[1].position.x);
        } else {
          return 240 - this.keypoints[1].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftEyeY () {
      if (this.keypoints[1]) {
        return 180 - this.keypoints[1].position.y;
      } else {
        return "";
      }
    }

    getRightEyeX () {
      if (this.keypoints[2]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[2].position.x);
        } else {
          return 240 - this.keypoints[2].position.x;
        }
      } else {
        return "";
      }
    }

    getRightEyeY () {
      if (this.keypoints[2]) {
        return 180 - this.keypoints[2].position.y;
      } else {
        return "";
      }
    }

    getLeftEarX () {
      if (this.keypoints[3]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[3].position.x);
        } else {
          return 240 - this.keypoints[3].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftEarY () {
      if (this.keypoints[3]) {
        return 180 - this.keypoints[3].position.y;
      } else {
        return "";
      }
    }

    getRightEarX () {
      if (this.keypoints[4]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[4].position.x);
        } else {
          return 240 - this.keypoints[4].position.x;
        }
      } else {
        return "";
      }
    }

    getRightEarY () {
      if (this.keypoints[4]) {
        return 180 - this.keypoints[4].position.y;
      } else {
        return "";
      }
    }

    getLeftShoulderX () {
      if (this.keypoints[5]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[5].position.x);
        } else {
          return 240 - this.keypoints[5].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftShoulderY () {
      if (this.keypoints[5]) {
        return 180 - this.keypoints[5].position.y;
      } else {
        return "";
      }
    }

    getRightShoulderX () {
      if (this.keypoints[6]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[6].position.x);
        } else {
          return 240 - this.keypoints[6].position.x;
        }
      } else {
        return "";
      }
    }

    getRightShoulderY () {
      if (this.keypoints[6]) {
        return 180 - this.keypoints[6].position.y;
      } else {
        return "";
      }
    }

    getLeftElbowX () {
      if (this.keypoints[7]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[7].position.x);
        } else {
          return 240 - this.keypoints[7].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftElbowY () {
      if (this.keypoints[7]) {
        return 180 - this.keypoints[7].position.y;
      } else {
        return "";
      }
    }

    getRightElbowX () {
      if (this.keypoints[8]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[8].position.x);
        } else {
          return 240 - this.keypoints[8].position.x;
        }
      } else {
        return "";
      }
    }

    getRightElbowY () {
      if (this.keypoints[8]) {
        return 180 - this.keypoints[8].position.y;
      } else {
        return "";
      }
    }

    getLeftWristX () {
      if (this.keypoints[9]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[9].position.x);
        } else {
          return 240 - this.keypoints[9].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftWristY () {
      if (this.keypoints[9]) {
        return 180 - this.keypoints[9].position.y;
      } else {
        return "";
      }
    }

    getRightWristX () {
      if (this.keypoints[10]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[10].position.x);
        } else {
          return 240 - this.keypoints[10].position.x;
        }
      } else {
        return "";
      }
    }

    getRightWristY () {
      if (this.keypoints[10]) {
        return 180 - this.keypoints[10].position.y;
      } else {
        return "";
      }
    }

    getLeftHipX () {
      if (this.keypoints[11]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[11].position.x);
        } else {
          return 240 - this.keypoints[11].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftHipY () {
      if (this.keypoints[11]) {
        return 180 - this.keypoints[11].position.y;
      } else {
        return "";
      }
    }

    getRightHipX () {
      if (this.keypoints[12]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[12].position.x);
        } else {
          return 240 - this.keypoints[12].position.x;
        }
      } else {
        return "";
      }
    }

    getRightHipY () {
      if (this.keypoints[12]) {
        return 180 - this.keypoints[12].position.y;
      } else {
        return "";
      }
    }

    getLeftKneeX () {
      if (this.keypoints[13]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[13].position.x);
        } else {
          return 240 - this.keypoints[13].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftKneeY () {
      if (this.keypoints[13]) {
        return 180 - this.keypoints[13].position.y;
      } else {
        return "";
      }
    }

    getRightKneeX () {
      if (this.keypoints[14]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[14].position.x);
        } else {
          return 240 - this.keypoints[14].position.x;
        }
      } else {
        return "";
      }
    }

    getRightKneeY () {
      if (this.keypoints[14]) {
        return 180 - this.keypoints[14].position.y;
      } else {
        return "";
      }
    }

    getLeftAnkleX () {
      if (this.keypoints[15]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[15].position.x);
        } else {
          return 240 - this.keypoints[15].position.x;
        }
      } else {
        return "";
      }
    }

    getLeftAnkleY () {
      if (this.keypoints[15]) {
        return 180 - this.keypoints[15].position.y;
      } else {
        return "";
      }
    }

    getRightAnkleX () {
      if (this.keypoints[16]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.keypoints[16].position.x);
        } else {
          return 240 - this.keypoints[16].position.x;
        }
      } else {
        return "";
      }
    }

    getRightAnkleY () {
      if (this.keypoints[16]) {
        return 180 - this.keypoints[16].position.y;
      } else {
        return "";
      }
    }

    videoToggle (args) {
      let state = args.VIDEO_STATE;
      if (state === 'off') {
        this.runtime.ioDevices.video.disableVideo();
      } else {
        this.runtime.ioDevices.video.enableVideo();
        this.runtime.ioDevices.video.mirror = state === "on";
      }
    }

    setLocale() {
      let locale = formatMessage.setup().locale;
      if (AvailableLocales.includes(locale)) {
        return locale;
      } else {
        return 'en';
      }
    }
}

module.exports = Scratch3Posenet2ScratchBlocks;