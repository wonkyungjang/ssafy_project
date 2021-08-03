package com.ssafy.happyhouse.util;
import java.io.IOException;
import java.util.List;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import org.xml.sax.SAXException;
import com.ssafy.happyhouse.model.dto.HouseDeal;
public class ADSHTest {
    public static void main(String[] args) {
        String aptDealFilePath = "res/AptDealHistory.xml";
        // 파서 구현체 Xerces -> IBM -> com sum 헌사
        SAXParserFactory factory = SAXParserFactory.newInstance();
        
        try {
            SAXParser parser = factory.newSAXParser();
            
            APTDealSAXHandler aptDealHandler = new APTDealSAXHandler();
            parser.parse(aptDealFilePath,  aptDealHandler);
            List<HouseDeal> aptDeals = aptDealHandler.getHouses();
            for (HouseDeal h : aptDeals) {
                System.out.println(h);
            }
        } catch (ParserConfigurationException e) {
            System.out.println("환경확인: " + e);
        } catch (SAXException e) {
        	 System.out.println("파서 중 에러" + e);
        } catch (IOException e) {
            System.out.println(aptDealFilePath + " 읽기 중 에러: " + e);
        }
    }
}