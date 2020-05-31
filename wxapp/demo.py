from WXBizDataCrypt import WXBizDataCrypt

def main():
    appId = 'wx08fefd101492cbd6'
    sessionKey = 'YIGfplorYPxwQslGpdpTfA=='
    encryptedData = 'vQaV2g7GQBiU3RYW02l8oIcxUQDWJg/aQgc0N2/f/h6KgoCkDc6nr9fjrLlSSRrrZkGgYxr//gkl9tgCrAiqpGBdOx/ZxcMZOfb74PTlCu687Ma/m9M05dnreSoug4R95kBwwgsG22T6g6FSOxPUGjIh7VuJDBWnkP11vN7hq9DqvPlO7hZNqiXXAjpNfFpR0GYvuSPtw9djrUEcNkeBtw=='
    iv = 'oHcRf8ypRK++cEZ5bAtigA=='
    pc = WXBizDataCrypt(appId, sessionKey)

    print(pc.decrypt(encryptedData, iv))

if __name__ == '__main__':
    main()
